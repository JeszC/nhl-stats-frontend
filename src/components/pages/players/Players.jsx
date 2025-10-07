import {useCallback, useEffect, useRef, useState} from "react";
import constants from "../../../data/constants.json";
import goalieStandings from "../../../data/goalieStandings.json";
import skaterStandings from "../../../data/skaterStandings.json";
import {getPlayerFirstName, getPlayerLastName} from "../../../scripts/parsing.js";
import {compareTextual, getResponseData, getValue, sortObjects} from "../../../scripts/utils.js";
import Spinner from "../../shared/animations/spinner/Spinner";
import PageBar from "../../shared/common/pageBar/PageBar.jsx";
import PlayerDialog from "../../shared/dialogs/player/PlayerDialog";
import ErrorDialog from "../../shared/errors/ErrorDialog";
import ErrorDialogLockout from "../../shared/errors/ErrorDialogLockout";
import ErrorDialogSeasonUnstarted from "../../shared/errors/ErrorDialogSeasonUnstarted.jsx";
import MainContent from "../../shared/main/MainContent.jsx";
import SeasonSelect from "../../shared/sidebar/components/SeasonSelect";
import TeamSelect from "../../shared/sidebar/components/TeamSelect";
import SidebarHelp from "../../shared/sidebar/SidebarHelp";
import SidebarOptions from "../../shared/sidebar/SidebarOptions";
import TableHeader from "../../shared/table/TableHeader.jsx";
import Filters from "./components/Filters";
import Legend from "./components/Legend";
import PlayerTypeSelect from "./components/PlayerTypeSelect";
import SeasonTypeSelect from "./components/SeasonTypeSelect";
import TableContent from "./components/tableContent/TableContent";
import "./Players.css";

function defaultCompare(player1, player2) {
    let teamKey = goalieStandings.columns.team.nhlKey;
    let teamDifference = compareTextual(getValue(teamKey, player1), getValue(teamKey, player2));
    if (teamDifference === 0) {
        return compareFullName(player1, player2);
    }
    return teamDifference;
}

function compareFullName(player1, player2) {
    let nameKey = goalieStandings.columns.player.nhlKey;
    let lastNameKey = [nameKey[2], nameKey[3]];
    let lastNameDifference = compareTextual(getValue(lastNameKey, player1), getValue(lastNameKey, player2));
    if (lastNameDifference === 0) {
        let firstNameKey = [nameKey[0], nameKey[1]];
        return compareTextual(getValue(firstNameKey, player1), getValue(firstNameKey, player2));
    }
    return lastNameDifference;
}

function Players({showOptions, setShowOptions, showHelp}) {
    const [data, setData] = useState([]);
    const [players, setPlayers] = useState({goalies: [], skaters: []});
    const [visibleSkaters, setVisibleSkaters] = useState([]);
    const [visibleGoalies, setVisibleGoalies] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState("");
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [showGoalies, setShowGoalies] = useState(false);
    const [showPlayoffs, setShowPlayoffs] = useState(false);
    const [positions, setPositions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [sorting, setSorting] = useState({key: "", ascending: false, target: null});
    const [selectedPlayer, setSelectedPlayer] = useState({});
    const [searchString, setSearchString] = useState("");
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [playerFetchState, setPlayerFetchState] = useState(constants.fetchState.finished);
    const [page, setPage] = useState(0);
    const [fetchTrigger, setFetchTrigger] = useState(0);
    const [sortedColumn, setSortedColumn] = useState(0);
    const [seasonStarted, setSeasonStarted] = useState(true);
    const defaultSkaterHeader = useRef(null);
    const defaultGoalieHeader = useRef(null);
    const dialog = useRef(null);
    const numberOfPlayersToShowPerPage = 50;
    const defaultSortedCategorySkater = skaterStandings.columns.points;
    const defaultSortedCategoryGoalie = goalieStandings.columns.savePercentage;

    function applySorting(key, ascending, target) {
        if (sorting.target) {
            sorting.target.classList.remove(constants.sortedColumnClassName);
            sorting.target.children[0].textContent = "";
        }
        if (target) {
            target.classList.add(constants.sortedColumnClassName);
            target.children[0].textContent = ascending ? constants.indicator.ascending : constants.indicator.descending;
            setSortedColumn(target.parentNode.cellIndex - 1);
        }
        setSorting({key, ascending, target});
    }

    function applySavedView() {
        let savedView = localStorage.getItem(constants.localStorageKeys.player.view);
        if (savedView && savedView.trim().toLowerCase() === "true") {
            setShowGoalies(true);
            applySorting(defaultSortedCategoryGoalie, false, defaultGoalieHeader.current);
        } else {
            applySorting(defaultSortedCategorySkater, false, defaultSkaterHeader.current);
        }
    }

    function filterSkaters(skaters, positions, countries) {
        let filteredSkaters = skaters;
        if (positions.length > 0) {
            filteredSkaters = filteredSkaters.filter(skater => positions.includes(skater.positionCode));
        }
        if (countries.length > 0) {
            filteredSkaters = filteredSkaters.filter(skater => countries.includes(skater.birthCountry));
        }
        return filteredSkaters;
    }

    function filterGoalies(goalies, countries) {
        let filteredGoalies = goalies;
        if (countries.length > 0) {
            filteredGoalies = filteredGoalies.filter(goalie => countries.includes(goalie.birthCountry));
        }
        return filteredGoalies;
    }

    function filterByTextSearch(players, searchString) {
        return players.filter(player => {
            let first = getPlayerFirstName(player).trim()
                                                  .toLowerCase()
                                                  .normalize("NFD")
                                                  .replace(/[\u0300-\u036f]/g, "");
            let last = getPlayerLastName(player).trim()
                                                .toLowerCase()
                                                .normalize("NFD")
                                                .replace(/[\u0300-\u036f]/g, "");
            let firstLast = `${first} ${last}`.trim()
                                              .normalize("NFD")
                                              .replace(/[\u0300-\u036f]/g, "")
                                              .toLowerCase();
            let lastFirst = `${last} ${first}`.trim()
                                              .normalize("NFD")
                                              .replace(/[\u0300-\u036f]/g, "")
                                              .toLowerCase();
            let query = searchString.trim()
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .toLowerCase();
            return first.includes(query) || last.includes(query) ||
                   firstLast.includes(query) || lastFirst.includes(query);
        });
    }

    async function getPlayerStats(team, season) {
        let response = await fetch(`${constants.baseURL}/players/getPlayers/${team}/${season}`);
        return await getResponseData(response, "Error fetching players.");
    }

    async function getListOfTeamsThatExistInTheSelectedSeason(selectedTeams, season) {
        let teamsThatExistInSeason = [];
        let teamListResponse = await fetch(`${constants.baseURL}/teams/getTeams/${season}`);
        let seasonsTeams = await getResponseData(teamListResponse, "Error fetching season teams.");
        for (let selectedTeam of selectedTeams) {
            for (let seasonsTeam of seasonsTeams) {
                if (seasonsTeam.abbrev === selectedTeam.teamAbbrev) {
                    teamsThatExistInSeason.push(selectedTeam);
                    break;
                }
            }
        }
        return teamsThatExistInSeason;
    }

    const getTeamsPlayerStats = useCallback(async (teams, season) => {
        let teamsThatExistInSeason = await getListOfTeamsThatExistInTheSelectedSeason(teams, season);
        let teamStats = [];
        for await (let team of teamsThatExistInSeason) {
            teamStats.push(getPlayerStats(team.teamAbbrev, season));
        }
        return teamStats;
    }, []);

    function setPlayerData() {
        if (fetchState === constants.fetchState.finished) {
            let goalies = [];
            let skaters = [];
            if (showPlayoffs) {
                for (let team of data) {
                    goalies = goalies.concat(team.playoffs.goalies);
                    skaters = skaters.concat(team.playoffs.skaters);
                }
            } else {
                for (let team of data) {
                    goalies = goalies.concat(team.regularSeason.goalies);
                    skaters = skaters.concat(team.regularSeason.skaters);
                }
            }
            setPlayers({goalies, skaters});
            setVisibleGoalies(goalies);
            setVisibleSkaters(skaters);
        }
    }

    function getPlayerData() {
        async function getPlayers() {
            setFetchState(constants.fetchState.loading);
            setData([]);
            setPlayers({skaters: [], goalies: []});
            setVisibleSkaters([]);
            setVisibleGoalies([]);
            setPositions([]);
            setCountries([]);
            setShowPlayoffs(false);
            if (selectedSeason) {
                setSeasonStarted(await hasSeasonStarted(selectedSeason));
                try {
                    let promises = await getTeamsPlayerStats(selectedTeams, selectedSeason);
                    let result = await Promise.all(promises);
                    let goalies = [];
                    let skaters = [];
                    for (let team of result) {
                        goalies = goalies.concat(team.regularSeason.goalies);
                        skaters = skaters.concat(team.regularSeason.skaters);
                    }
                    setData(result);
                    setPlayers({goalies, skaters});
                    setVisibleGoalies(goalies);
                    setVisibleSkaters(skaters);
                    setFetchState(constants.fetchState.finished);
                } catch (ignored) {
                    setFetchState(constants.fetchState.error);
                }
            } else {
                setFetchState(constants.fetchState.finished);
            }
        }

        getPlayers().then();
    }

    async function hasSeasonStarted(season) {
        let response = await fetch(`${constants.baseURL}/schedule/getSeasonDates/${season}`);
        let seasonDates = await getResponseData(response, "Error fetching season dates.");
        let startDate = new Date(seasonDates.seasonStartDate);
        return new Date() >= startDate;
    }

    function sortGoalies(key, goalies) {
        if (key) {
            if (key === goalieStandings.columns.player) {
                goalies.sort(compareFullName);
            } else {
                sortObjects(goalies, key.nhlKey, key.numeric, defaultCompare);
            }
        }
    }

    function sortSkaters(key, skaters) {
        if (key) {
            if (key === skaterStandings.columns.player) {
                skaters.sort(compareFullName);
            } else {
                sortObjects(skaters, key.nhlKey, key.numeric, defaultCompare);
            }
        }
    }

    function filterAndSortPlayers() {
        if (fetchState === constants.fetchState.finished) {
            if (showGoalies) {
                let filteredGoalies = filterGoalies(players.goalies, countries);
                filteredGoalies = filterByTextSearch(filteredGoalies, searchString);
                sortGoalies(sorting.key, filteredGoalies);
                setVisibleGoalies(sorting.ascending ? filteredGoalies : filteredGoalies.reverse());
            } else {
                let filteredSkaters = filterSkaters(players.skaters, positions, countries);
                filteredSkaters = filterByTextSearch(filteredSkaters, searchString);
                sortSkaters(sorting.key, filteredSkaters);
                setVisibleSkaters(sorting.ascending ? filteredSkaters : filteredSkaters.reverse());
            }
            setPage(0);
        }
    }

    function resetPlayerFilters() {
        if (!showGoalies) {
            setPositions([]);
        }
    }

    function setUpOnLoad() {
        document.title = "Player Standings";
        setShowOptions(true);
        applySavedView();
    }

    useEffect(setPlayerData, [fetchState, showPlayoffs, data]);

    useEffect(getPlayerData, [fetchTrigger, selectedTeams, selectedSeason, getTeamsPlayerStats]);

    useEffect(filterAndSortPlayers, [fetchState, showGoalies, players.goalies, players.skaters,
                                     countries, positions, searchString, sorting.key, sorting.ascending]);

    useEffect(resetPlayerFilters, [showGoalies]);

    useEffect(setUpOnLoad, []);

    return <>
        <SidebarOptions showSidebar={showOptions}
                        title={"Options / Filters"}
                        components={[<PlayerTypeSelect showGoalies={showGoalies}
                                                       setShowGoalies={setShowGoalies}
                                                       applySorting={applySorting}
                                                       defaultSkaterHeader={defaultSkaterHeader}
                                                       defaultGoalieHeader={defaultGoalieHeader}
                                                       defaultSortedCategorySkater={defaultSortedCategorySkater}
                                                       defaultSortedCategoryGoalie={defaultSortedCategoryGoalie}
                                                       localStorageKey={constants.localStorageKeys.player.view}>
                                     </PlayerTypeSelect>,
                                     <SeasonTypeSelect showPlayoffs={showPlayoffs}
                                                       setShowPlayoffs={setShowPlayoffs}>
                                     </SeasonTypeSelect>,
                                     <SeasonSelect localStorageKey={constants.localStorageKeys.player.season}
                                                   setSelectedSeasons={setSelectedSeason}
                                                   fetchState={fetchState}
                                                   setFetchState={setFetchState}
                                                   setFetchTrigger={setFetchTrigger}>
                                     </SeasonSelect>,
                                     <TeamSelect season={selectedSeason}
                                                 localStorageKey={constants.localStorageKeys.player.teams}
                                                 setSelectedTeams={setSelectedTeams}
                                                 fetchState={fetchState}
                                                 setFetchState={setFetchState}
                                                 fetchTrigger={fetchTrigger}>
                                     </TeamSelect>,
                                     <Filters players={players}
                                              selectedTeams={selectedTeams}
                                              showGoalies={showGoalies}
                                              setPositions={setPositions}
                                              setCountries={setCountries}
                                              setSearchString={setSearchString}>
                                     </Filters>]}>
        </SidebarOptions>
        <MainContent showOptions={showOptions} showHelp={showHelp} content={
            <>
                {
                    selectedSeason === constants.lockoutSeason
                    ? <ErrorDialogLockout></ErrorDialogLockout>
                    : seasonStarted
                      ? selectedSeason && selectedTeams.length > 0 &&
                        data.length === 0 && fetchState === constants.fetchState.finished
                        ? <ErrorDialog errorMessage={"Selected team(s) did not play during the selected season."}>
                        </ErrorDialog>
                        : null
                      : fetchState === constants.fetchState.finished
                        ? <ErrorDialogSeasonUnstarted></ErrorDialogSeasonUnstarted>
                        : null
                }
                {fetchState === constants.fetchState.loading ? <Spinner></Spinner> : null}
                {
                    fetchState === constants.fetchState.error
                    ? <ErrorDialog errorMessage={"Failed to fetch player standings. The server might be offline."}>
                    </ErrorDialog>
                    : null
                }
                <table className={"playersTable tableAlternateRows"} aria-label={"Player standings table"}>
                    <thead>
                        <tr className={showGoalies ? "" : "hidden"}>
                            <th title={"Number"}>#</th>
                            <TableHeader data={goalieStandings}
                                         sortedColumn={sortedColumn}
                                         sortingFunction={applySorting}
                                         sortingDirection={sorting.ascending}
                                         defaultHeader={defaultGoalieHeader}
                                         defaultColumn={defaultSortedCategoryGoalie}>
                            </TableHeader>
                        </tr>
                        <tr className={showGoalies ? "hidden" : ""}>
                            <th title={"Number"}>#</th>
                            <TableHeader data={skaterStandings}
                                         sortedColumn={sortedColumn}
                                         sortingFunction={applySorting}
                                         sortingDirection={sorting.ascending}
                                         defaultHeader={defaultSkaterHeader}
                                         defaultColumn={defaultSortedCategorySkater}>
                            </TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        <TableContent showGoalies={showGoalies}
                                      goalies={visibleGoalies}
                                      skaters={visibleSkaters}
                                      setSelectedPlayer={setSelectedPlayer}
                                      dialog={dialog}
                                      setPlayerFetchState={setPlayerFetchState}
                                      page={page}
                                      numberOfPlayersToShowPerPage={numberOfPlayersToShowPerPage}
                                      sortedColumn={sortedColumn}>
                        </TableContent>
                    </tbody>
                </table>
                <PageBar items={showGoalies ? visibleGoalies : visibleSkaters}
                         numberOfItemsToShowPerPage={numberOfPlayersToShowPerPage}
                         page={page}
                         setPage={setPage}>
                </PageBar>
                <PlayerDialog dialogReference={dialog}
                              selectedPlayer={selectedPlayer}
                              fetchState={playerFetchState}>
                </PlayerDialog>
            </>
        }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp}
                     title={"Help"}
                     components={[
                         <p>After selecting a season and a team, click on a player to view player information.</p>,
                         <Legend showGoalies={showGoalies}></Legend>
                     ]}>
        </SidebarHelp>
    </>;
}

export default Players;
