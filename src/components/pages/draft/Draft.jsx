import {useCallback, useEffect, useRef, useState} from "react";
import constants from "../../../data/constants.json";
import {compareNumeric, compareTextual, getResponseData, getValue, sortObjects} from "../../../scripts/utils.js";
import Spinner from "../../shared/animations/spinner/Spinner";
import PlayerDialog from "../../shared/dialogs/player/PlayerDialog";
import ErrorDialogRetry from "../../shared/errors/ErrorDialogRetry";
import MainContent from "../../shared/main/MainContent.jsx";
import SeasonSelect from "../../shared/sidebar/components/SeasonSelect";
import SidebarHelp from "../../shared/sidebar/SidebarHelp";
import SidebarOptions from "../../shared/sidebar/SidebarOptions";
import draftColumns from "./../../../data/draft.json";
import DraftTable from "./components/DraftTable";
import Filters from "./components/Filters";
import Legend from "./components/Legend";
import "./Draft.css";

function defaultCompare(player1, player2) {
    let key = draftColumns.columns.overallPick.nhlKey;
    return compareNumeric(getValue(key, player1), getValue(key, player2));
}

function compareFullName(player1, player2) {
    let lastNameKey = ["lastName"];
    let firstNameKey = ["firstName"];
    let lastNameDifference = compareTextual(getValue(lastNameKey, player1), getValue(lastNameKey, player2));
    if (lastNameDifference === 0) {
        let firstNameDifference = compareTextual(getValue(firstNameKey, player1), getValue(lastNameKey, player2));
        if (firstNameDifference === 0) {
            return defaultCompare(player1, player2);
        }
        return firstNameDifference;
    }
    return lastNameDifference;
}

function compareBirthDate(player1, player2) {
    let key = draftColumns.columns.birthDate.nhlKey;
    let birthDatePlayer1 = getValue(key, player1);
    let birthDatePlayer2 = getValue(key, player2);
    if (!birthDatePlayer1 && !birthDatePlayer2) {
        return 0;
    }
    if (!birthDatePlayer1) {
        return 1;
    }
    if (!birthDatePlayer2) {
        return -1;
    }
    let dateParts1 = birthDatePlayer1.split("-");
    let dateParts2 = birthDatePlayer2.split("-");
    let year1 = parseInt(dateParts1[0]);
    let year2 = parseInt(dateParts2[0]);
    let yearDifference = compareNumeric(year1, year2);
    if (yearDifference === 0) {
        let month1 = parseInt(dateParts1[1]);
        let month2 = parseInt(dateParts2[1]);
        let monthDifference = compareNumeric(month1, month2);
        if (monthDifference === 0) {
            let day1 = parseInt(dateParts1[2]);
            let day2 = parseInt(dateParts2[2]);
            let dayDifference = compareNumeric(day1, day2);
            return dayDifference === 0 ? defaultCompare(player1, player2) : dayDifference;
        }
        return monthDifference;
    }
    return yearDifference;
}

function compareAge(player1, player2) {
    let key = draftColumns.columns.age.nhlKey;
    let ageDifference = compareNumeric(getValue(key, player1), getValue(key, player2));
    if (ageDifference === 0) {
        return -compareBirthDate(player1, player2);
    }
    return ageDifference;
}

function Draft({showOptions, setShowOptions, showHelp}) {
    const [season, setSeason] = useState("");
    const [draft, setDraft] = useState([]);
    const [visibleDraft, setVisibleDraft] = useState([]);
    const [teams, setTeams] = useState([]);
    const [positions, setPositions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [draftTeams, setDraftTeams] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState({});
    const [fetchState, setFetchState] = useState(constants.fetchState.finished);
    const [playerFetchState, setPlayerFetchState] = useState(constants.fetchState.finished);
    const [sorting, setSorting] = useState({key: "", ascending: false, target: null});
    const [fetchTrigger, setFetchTrigger] = useState(0);
    const [sortedColumn, setSortedColumn] = useState(0);
    const defaultHeader = useRef(null);
    const dialog = useRef(null);
    const defaultSortedCategory = draftColumns.columns.overallPick;

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

    async function getSeasonTeams(season) {
        let teamResponse = await fetch(`${constants.baseURL}/teams/getTeams/${season}`);
        return await getResponseData(teamResponse, "Error fetching season teams.");
    }

    async function getDraftResults(season) {
        let response = await fetch(`${constants.baseURL}/draft/getDraftResults/${season}`);
        return await getResponseData(response, "Error fetching draft results.");
    }

    async function retryGetDraftResults(season) {
        setFetchState(constants.fetchState.loading);
        getDraftResults(season)
            .then(result => {
                setDraft(result);
                setVisibleDraft(result);
                setFetchState(constants.fetchState.finished);
            })
            .catch(ignored => setFetchState(constants.fetchState.error));
    }

    function filterDraft(draft, positions, countries, draftTeams) {
        let filteredDraft = [].concat(draft);
        if (positions.length > 0) {
            filteredDraft = filteredDraft.filter(player => positions.includes(player.position));
        }
        if (countries.length > 0) {
            filteredDraft = filteredDraft.filter(player => countries.includes(player.countryCode));
        }
        if (draftTeams.length > 0) {
            filteredDraft = filteredDraft.filter(player => draftTeams.includes(player.triCode));
        }
        return filteredDraft;
    }

    function sortDraft(key, draft) {
        if (key) {
            switch (key) {
                case draftColumns.columns.player:
                    draft.sort(compareFullName);
                    break;
                case draftColumns.columns.birthDate:
                    draft.sort(compareBirthDate);
                    break;
                case draftColumns.columns.age:
                    draft.sort(compareAge);
                    break;
                default:
                    sortObjects(draft, key.nhlKey, key.numeric, defaultCompare);
                    break;
            }
        }
    }

    function filterAndSortDraft() {
        let filteredDraft = filterDraft(draft, positions, countries, draftTeams);
        sortDraft(sorting.key, filteredDraft);
        setVisibleDraft(sorting.ascending ? filteredDraft : filteredDraft.reverse());
    }

    const fetchDraftData = useCallback(async () => {
        setDraft([]);
        setVisibleDraft([]);
        setFetchState(constants.fetchState.loading);
        if (season) {
            let data;
            try {
                data = await Promise.all([
                    getDraftResults(season),
                    getSeasonTeams(season)
                ]);
            } catch (ignored) {
                setFetchState(constants.fetchState.error);
                return;
            }
            let draftResults = data[0];
            let teams = data[1];
            setDraft(draftResults);
            setVisibleDraft(draftResults);
            setTeams(teams);
        }
        setFetchState(constants.fetchState.finished);
    }, [season]);

    function setUpOnLoad() {
        document.title = "Draft Results";
        setShowOptions(true);
        applySorting(defaultSortedCategory, true, defaultHeader.current);
    }

    useEffect(filterAndSortDraft, [draft, positions, countries, draftTeams, sorting.key, sorting.ascending]);

    useEffect(() => {
        fetchDraftData().then();
    }, [fetchTrigger, fetchDraftData]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <>
        <SidebarOptions showSidebar={showOptions}
                        title={"Options / Filters"}
                        components={[
                            <SeasonSelect localStorageKey={constants.localStorageKeys.draft.season}
                                          setSelectedSeasons={setSeason}
                                          fetchState={fetchState}
                                          setFetchState={setFetchState}
                                          setFetchTrigger={setFetchTrigger}>
                            </SeasonSelect>,
                            <Filters draft={draft}
                                     setSelectedPositions={setPositions}
                                     setSelectedCountries={setCountries}
                                     setSelectedDraftTeams={setDraftTeams}>
                            </Filters>
                        ]}>
        </SidebarOptions>
        <MainContent showOptions={showOptions} showHelp={showHelp} content={
            <>
                {fetchState === constants.fetchState.loading ? <Spinner></Spinner> : null}
                {
                    fetchState === constants.fetchState.error
                    ? <ErrorDialogRetry errorMessage={"Failed to fetch draft results. The server might be offline."}
                                        onClick={() => retryGetDraftResults(season)}>
                    </ErrorDialogRetry>
                    : null
                }
                <DraftTable defaultHeader={defaultHeader}
                            defaultColumn={defaultSortedCategory}
                            applySorting={applySorting}
                            sortingDirection={sorting.ascending}
                            sortedColumn={sortedColumn}
                            draftResults={visibleDraft}
                            teams={teams}
                            dialog={dialog}
                            setSelectedPlayer={setSelectedPlayer}
                            setPlayerFetchState={setPlayerFetchState}>
                </DraftTable>
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
                         <p>After selecting a season, click on a player to view player information.</p>,
                         <Legend></Legend>
                     ]}>
        </SidebarHelp>
    </>;
}

export default Draft;
