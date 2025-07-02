import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import constants from "../../../data/constants.json";
import recordColumns from "../../../data/recordFormats.json";
import teamStandingsColumns from "../../../data/teamStandings.json";
import {
    compareNumeric,
    compareTextual,
    getResponsesData,
    getValue,
    hasSeasonStarted,
    sortObjects
} from "../../../scripts/utils.js";
import Spinner from "../../shared/animations/spinner/Spinner";
import PlayoffTree from "../../shared/common/playoffTree/PlayoffTree";
import TeamDialog from "../../shared/dialogs/team/TeamDialog";
import ErrorDialogLockout from "../../shared/errors/ErrorDialogLockout";
import ErrorDialogRetry from "../../shared/errors/ErrorDialogRetry";
import ErrorDialogSeasonUnstarted from "../../shared/errors/ErrorDialogSeasonUnstarted.jsx";
import MainContent from "../../shared/main/MainContent.jsx";
import SeasonSelect from "../../shared/sidebar/components/SeasonSelect";
import SidebarHelp from "../../shared/sidebar/SidebarHelp";
import SidebarOptions from "../../shared/sidebar/SidebarOptions";
import Filters from "./components/Filters";
import Legend from "./components/Legend";
import SeasonType from "./components/SeasonType";
import StandingsTable from "./components/StandingsTable";
import "./Standings.css";

function defaultCompare(team1, team2) {
    let pointPercentageKey = teamStandingsColumns.columns.pointPercentage.nhlKey;
    let pointPercentageDifference = compareNumeric(
        getValue(pointPercentageKey, team1), getValue(pointPercentageKey, team2));
    if (pointPercentageDifference === 0) {
        let pointsKey = teamStandingsColumns.columns.points.nhlKey;
        let pointsDifference = compareNumeric(getValue(pointsKey, team1), getValue(pointsKey, team2));
        if (pointsDifference === 0) {
            let regulationWinsKey = teamStandingsColumns.columns.regulationWins.nhlKey;
            let regulationWinsDifference = compareNumeric(
                getValue(regulationWinsKey, team1), getValue(regulationWinsKey, team2));
            if (regulationWinsDifference === 0) {
                let regulationOvertimeWinsKey = ["regulationPlusOtWins"];
                let regulationOvertimeWinsDifference = compareNumeric(
                    getValue(regulationOvertimeWinsKey, team1), getValue(regulationOvertimeWinsKey, team2));
                if (regulationOvertimeWinsDifference === 0) {
                    let winsKey = teamStandingsColumns.columns.wins.nhlKey;
                    return compareNumeric(getValue(winsKey, team1), getValue(winsKey, team2));
                }
                return regulationOvertimeWinsDifference;
            }
            return regulationWinsDifference;
        }
        return pointsDifference;
    }
    return pointPercentageDifference;
}

function compareRecord(record) {
    return (team1, team2) => {
        for (let i = 0; i < record.nhlKey.length; i++) {
            let key = record.nhlKey[i];
            let difference;
            if (record.comparison[i] < 0) {
                difference = -compareNumeric(getValue([key], team1), getValue([key], team2));
            } else {
                difference = compareNumeric(getValue([key], team1), getValue([key], team2));
            }
            if (difference !== 0) {
                return difference;
            }
        }
        return defaultCompare(team1, team2);
    };
}

function compareStreak(team1, team2) {
    let streakKey = teamStandingsColumns.columns.streak.nhlKey;
    let streakCode = [streakKey[0]];
    let streakCount = [streakKey[1]];
    let streakCodeDifference = compareTextual(getValue(streakCode, team1), getValue(streakCode, team2));
    if (streakCodeDifference === 0) {
        let streakCountDifference;
        if (team1.streakCode === "L" || team1.streakCode === "OT") {
            streakCountDifference = -compareNumeric(getValue(streakCount, team1), getValue(streakCount, team2));
        } else {
            streakCountDifference = compareNumeric(getValue(streakCount, team1), getValue(streakCount, team2));
        }
        return streakCountDifference === 0 ? defaultCompare(team1, team2) : streakCountDifference;
    }
    return streakCodeDifference;
}

function Standings({showOptions, setShowOptions, showHelp}) {
    const [fullStandings, setFullStandings] = useState([]);
    const [visibleStandings, setVisibleStandings] = useState([]);
    const [playoffTree, setPlayoffTree] = useState({});
    const [season, setSeason] = useState("");
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [conferences, setConferences] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [sorting, setSorting] = useState({key: "", ascending: false, target: null});
    const [selectedTeam, setSelectedTeam] = useState({});
    const [teamFetchState, setTeamFetchState] = useState(constants.fetchState.finished);
    const [hasPlayoffTeams, setHasPlayoffTeams] = useState(false);
    const [seasonType, setSeasonType] = useState(constants.gameType.season.name);
    const [fetchTrigger, setFetchTrigger] = useState(0);
    const [sortedColumn, setSortedColumn] = useState(0);
    const [customizedTeamStandings, setCustomizedTeamStandings] = useState(teamStandingsColumns);
    const [seasonStarted, setSeasonStarted] = useState(true);
    const defaultHeader = useRef(null);
    const dialog = useRef(null);
    const defaultSortedCategory = customizedTeamStandings.columns.pointPercentage;

    const applySorting = useCallback((key, ascending, target) => {
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
    }, [sorting.target]);

    async function getStandingsAndPlayoffTree(season) {
        setSeasonStarted(await hasSeasonStarted(season));
        let responses = await Promise.all([
            fetch(`${constants.baseURL}/standings/getStandings/${season}`),
            fetch(`${constants.baseURL}/playoffs/getPlayoffTree/${season}`)
        ]);
        let standings;
        let playoffTree;
        try {
            let data = await getResponsesData(responses, "Error when fetching standings/playoff tree.");
            standings = data[0];
            playoffTree = data[1];
        } catch (ignored) {
            playoffTree = {};
        }
        return {
            standings,
            playoffTree
        };
    }

    function retryGetStandingsAndPlayoffTree(season) {
        setFetchState(constants.fetchState.loading);
        getStandingsAndPlayoffTree(season)
            .then(result => updateUserInterface(result))
            .catch(() => setFetchState(constants.fetchState.error));
    }

    function updateUserInterface(result) {
        setFetchState(constants.fetchState.finished);
        setFullStandings(result.standings);
        setVisibleStandings(result.standings);
        setPlayoffTree(result.playoffTree);
    }

    function hasAnyTeamMadePlayoffs(standings) {
        for (let team of standings) {
            if (getValue(["clinchIndicator"], team, false, undefined)) {
                return true;
            }
        }
        return false;
    }

    function filterStandings(standings, conferences, divisions) {
        if (conferences.length > 0) {
            return standings.filter(game => conferences.includes(getValue(["conferenceName"], game, false, undefined)));
        } else if (divisions.length > 0) {
            return standings.filter(game => divisions.includes(getValue(["divisionName"], game, false, undefined)));
        }
        return [].concat(standings);
    }

    const sortStandings = useCallback((key, standings) => {
        if (key) {
            switch (key) {
                case customizedTeamStandings.columns.record:
                    standings.sort(compareRecord(customizedTeamStandings.columns.record));
                    break;
                case customizedTeamStandings.columns.last10:
                    standings.sort(compareRecord(customizedTeamStandings.columns.last10));
                    break;
                case customizedTeamStandings.columns.streak:
                    standings.sort(compareStreak);
                    break;
                case customizedTeamStandings.columns.homeRecord:
                    standings.sort(compareRecord(customizedTeamStandings.columns.homeRecord));
                    break;
                case customizedTeamStandings.columns.awayRecord:
                    standings.sort(compareRecord(customizedTeamStandings.columns.awayRecord));
                    break;
                default:
                    sortObjects(standings, key.nhlKey, key.numeric, defaultCompare);
                    break;
            }
        }
    }, [customizedTeamStandings]);

    const filterAndSortStandings = useCallback(() => {
        let filteredStandings = filterStandings(fullStandings, conferences, divisions);
        sortStandings(sorting.key, filteredStandings);
        setVisibleStandings(sorting.ascending ? filteredStandings : filteredStandings.reverse());
    }, [conferences, divisions, fullStandings, sortStandings, sorting.ascending, sorting.key]);

    function applyOrRemoveDefaultSort() {
        if (seasonType === constants.gameType.season.name) {
            if (sorting.key === "") {
                applySorting(defaultSortedCategory, false, defaultHeader.current);
            }
        } else {
            applySorting("", false, null);
        }
    }

    const replaceYearSpecificColumns = useCallback(() => {
        let replacerFunction = () => {
            let seasonStartYear = parseInt(fullStandings[0]?.seasonId?.toString().substring(0, 4));
            let recordColumnsToUse = recordColumns.winsLossesOvertimelosses;
            let overtimeWins = teamStandingsColumns.columns.overtimeWins;
            let overtimeLosses = teamStandingsColumns.columns.overtimeLosses;
            let ties = teamStandingsColumns.columns.ties;
            if (seasonStartYear < 2005 && seasonStartYear >= 1999) {
                recordColumnsToUse = recordColumns.winsLossesTiesOvertimelosses;
            } else if (seasonStartYear < 1999) {
                recordColumnsToUse = recordColumns.winsLossesTies;
                overtimeLosses = undefined;
                if (seasonStartYear < 1983 && seasonStartYear >= 1943) {
                    overtimeWins = undefined;
                }
            } else {
                ties = undefined;
            }
            return (key, value) => {
                switch (key) {
                    case "record":
                        return recordColumnsToUse.record;
                    case "last10":
                        return recordColumnsToUse.lastTen;
                    case "homeRecord":
                        return recordColumnsToUse.homeRecord;
                    case "awayRecord":
                        return recordColumnsToUse.awayRecord;
                    case "overtimeWins":
                        return overtimeWins;
                    case "overtimeLosses":
                        return overtimeLosses;
                    case "ties":
                        return ties;
                    default:
                        return value;
                }
            };
        };
        setCustomizedTeamStandings(JSON.parse(JSON.stringify(teamStandingsColumns, replacerFunction())));
    }, [fullStandings]);

    function fetchSeasonData() {
        setFullStandings([]);
        setPlayoffTree({});
        setFetchState(constants.fetchState.loading);
        if (season) {
            if (season === constants.lockoutSeason) {
                setFetchState(constants.fetchState.finished);
            } else {
                getStandingsAndPlayoffTree(season)
                    .then(result => {
                        updateUserInterface(result);
                        setHasPlayoffTeams(hasAnyTeamMadePlayoffs(result.standings));
                    })
                    .catch(() => setFetchState(constants.fetchState.error));
            }
        }
    }

    function setUpOnLoad() {
        document.title = "Team Standings";
        setShowOptions(true);
        applySorting(defaultSortedCategory, false, defaultHeader.current);
    }

    useEffect(filterAndSortStandings, [filterAndSortStandings]);

    useEffect(applyOrRemoveDefaultSort, [seasonType, sorting.key, defaultSortedCategory, applySorting]);

    useEffect(replaceYearSpecificColumns, [replaceYearSpecificColumns]);

    useEffect(fetchSeasonData, [fetchTrigger, season]);

    useEffect(() => {
        applySorting(defaultSortedCategory, false, defaultHeader.current);
        // Reset sorting to default column when changing season, as different seasons might have different columns
        // and sorting breaks if the season is changed and the new season does not have the previously selected column.
        // Dependencies are also intentionally omitted because they break functionality.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [season]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <>
        <SidebarOptions showSidebar={showOptions}
                        title={"Options / Filters"}
                        components={[<SeasonType seasonType={seasonType} setSeasonType={setSeasonType}></SeasonType>,
                                     <SeasonSelect localStorageKey={constants.localStorageKeys.standings.season}
                                                   setSelectedSeasons={setSeason}
                                                   fetchState={fetchState}
                                                   setFetchState={setFetchState}
                                                   setFetchTrigger={setFetchTrigger}>
                                     </SeasonSelect>,
                                     <Filters fullStandings={fullStandings}
                                              setConferences={setConferences}
                                              setDivisions={setDivisions}>
                                     </Filters>]}>
        </SidebarOptions>
        <MainContent showOptions={showOptions} showHelp={showHelp} content={
            <>
                {fetchState === constants.fetchState.loading ? <Spinner></Spinner> : null}
                {
                    fetchState === constants.fetchState.error
                    ? <ErrorDialogRetry onClick={() => retryGetStandingsAndPlayoffTree(season)}
                                        errorMessage={"Failed to fetch team standings. The server might be offline."}>
                    </ErrorDialogRetry>
                    : null
                }
                {
                    season === constants.lockoutSeason
                    ? <ErrorDialogLockout></ErrorDialogLockout>
                    : seasonStarted
                      ? seasonType === constants.gameType.season.name
                        ? <StandingsTable defaultHeader={defaultHeader}
                                          defaultColumn={defaultSortedCategory}
                                          applySorting={applySorting}
                                          sortingDirection={sorting.ascending}
                                          sortedColumn={sortedColumn}
                                          columns={customizedTeamStandings}
                                          standings={visibleStandings}
                                          dialog={dialog}
                                          hasPlayoffTeams={hasPlayoffTeams}
                                          setSelectedTeam={setSelectedTeam}
                                          setTeamFetchState={setTeamFetchState}>
                        </StandingsTable>
                        : <PlayoffTree playoffTree={playoffTree}
                                       fetchState={fetchState}
                                       hasStickyTitle={true}>
                        </PlayoffTree>
                      : <ErrorDialogSeasonUnstarted></ErrorDialogSeasonUnstarted>
                }
                <TeamDialog dialogReference={dialog}
                            selectedTeam={selectedTeam}
                            fetchState={teamFetchState}
                            setFetchState={setTeamFetchState}>
                </TeamDialog>
            </>
        }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp}
                     title={"Help"}
                     components={[
                         <p>After selecting a season, click on a team to view team information.</p>,
                         <Legend teamStandings={customizedTeamStandings}></Legend>
                     ]}>
        </SidebarHelp>
    </>;
}

export default Standings;
