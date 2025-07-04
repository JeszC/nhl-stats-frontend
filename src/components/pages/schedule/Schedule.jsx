import {Fragment, useCallback, useEffect, useState} from "react";
import constants from "../../../data/constants.json";
import {getResponseData, getResponsesData} from "../../../scripts/utils.js";
import MainContent from "../../shared/main/MainContent.jsx";
import SeasonSelect from "../../shared/sidebar/components/SeasonSelect";
import TeamSelect from "../../shared/sidebar/components/TeamSelect";
import SidebarHelp from "../../shared/sidebar/SidebarHelp";
import SidebarOptions from "../../shared/sidebar/SidebarOptions";
import ScheduleCalendar from "./components/calendar/ScheduleCalendar";
import ExportICS from "./components/sidebars/ExportICS";
import FormatSelect from "./components/sidebars/FormatSelect";
import Legend from "./components/sidebars/Legend";
import VenueLegend from "./components/sidebars/VenueLegend";
import ViewOptions from "./components/sidebars/ViewOptions";
import ScheduleTable from "./components/table/ScheduleTable";
import "./Schedule.css";
import "../../../stylesheets/TeamColors.css";

function Schedule({showOptions, setShowOptions, showHelp}) {
    const [games, setGames] = useState([]);
    const [seasonStartDate, setSeasonStartDate] = useState("");
    const [seasonEndDate, setSeasonEndDate] = useState("");
    const [selectedSeason, setSelectedSeason] = useState("");
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [showScores, setShowScores] = useState(false);
    const [filterUpcomingGames, setFilterUpcomingGames] = useState(true);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [fetchTrigger, setFetchTrigger] = useState(0);

    function applySavedView() {
        let savedView = localStorage.getItem(constants.localStorageKeys.schedule.view);
        if (savedView && savedView.trim().toLowerCase() === "true") {
            setShowTable(true);
        }
    }

    const getSeasonDates = useCallback(async season => {
        let response = await fetch(`${constants.baseURL}/schedule/getSeasonDates/${season}`);
        return await getResponseData(response, "Error fetching season dates.");
    }, []);

    const filterDuplicateGames = useCallback(schedules => {
        let games = [];
        for (let schedule of schedules) {
            for (let game of schedule) {
                let alreadyListed = false;
                for (let i = 0; i < games.length && !alreadyListed; i++) {
                    if (games[i].id === game.id) {
                        alreadyListed = true;
                        break;
                    }
                }
                if (!alreadyListed) {
                    games.push(game);
                }
            }
        }
        return games;
    }, []);

    const getGames = useCallback(async (season, teams) => {
        let promises = [];
        for (let team of teams) {
            promises.push(fetch(`${constants.baseURL}/schedule/getSchedule/${season}/${team.teamAbbrev}`));
        }
        const responses = await Promise.all(promises);
        let data = await getResponsesData(responses, "Error fetching games.");
        let games = [];
        for (let team of data) {
            games.push(team.games);
        }
        return filterDuplicateGames(games);
    }, [filterDuplicateGames]);

    function fetchSelectedTeamSchedules() {
        async function fetchData() {
            setGames([]);
            if (selectedSeason && selectedSeason !== constants.lockoutSeason) {
                setFetchState(constants.fetchState.loading);
                try {
                    let seasonDates = await getSeasonDates(selectedSeason);
                    setSeasonStartDate(seasonDates.seasonStartDate);
                    setSeasonEndDate(seasonDates.seasonEndDate);
                    if (selectedTeams.length > 0) {
                        let games = await getGames(selectedSeason, selectedTeams);
                        setGames(games);
                    }
                    setFetchState(constants.fetchState.finished);
                } catch (ignored) {
                    setFetchState(constants.fetchState.error);
                }
            } else {
                setFetchState(constants.fetchState.finished);
            }
        }

        fetchData().then();
    }

    function setUpOnLoad() {
        document.title = "Team Schedules";
        setShowOptions(true);
        applySavedView();
    }

    useEffect(fetchSelectedTeamSchedules, [fetchTrigger, selectedSeason, selectedTeams, getSeasonDates, getGames]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <>
        <SidebarOptions showSidebar={showOptions}
                        title={"Options"}
                        components={[<FormatSelect showTable={showTable}
                                                   setShowTable={setShowTable}
                                                   localStorageKey={constants.localStorageKeys.schedule.view}>
                                     </FormatSelect>,
                                     <ViewOptions showTable={showTable}
                                                  showScores={showScores}
                                                  setShowScores={setShowScores}
                                                  filterUpcomingGames={filterUpcomingGames}
                                                  setFilterUpcomingGames={setFilterUpcomingGames}
                                                  selectedTeams={selectedTeams}>
                                     </ViewOptions>,
                                     <SeasonSelect localStorageKey={constants.localStorageKeys.schedule.season}
                                                   setSelectedSeasons={setSelectedSeason}
                                                   fetchState={fetchState}
                                                   setFetchState={setFetchState}
                                                   setFetchTrigger={setFetchTrigger}>
                                     </SeasonSelect>,
                                     <TeamSelect season={selectedSeason}
                                                 localStorageKey={constants.localStorageKeys.schedule.teams}
                                                 setSelectedTeams={setSelectedTeams}
                                                 fetchState={fetchState}
                                                 setFetchState={setFetchState}
                                                 fetchTrigger={fetchTrigger}>
                                     </TeamSelect>,
                                     <ExportICS games={games}
                                                selectedSeason={selectedSeason}
                                                selectedTeams={selectedTeams}
                                                fetchState={fetchState}>
                                     </ExportICS>]}>
        </SidebarOptions>
        <MainContent showOptions={showOptions} showHelp={showHelp} content={
            <>
                {
                    showTable
                    ? <ScheduleTable season={selectedSeason}
                                     games={games}
                                     selectedTeams={selectedTeams}
                                     showScores={showScores}
                                     filterUpcomingGames={filterUpcomingGames}
                                     fetchState={fetchState}>
                    </ScheduleTable>
                    : <ScheduleCalendar season={selectedSeason}
                                        games={games}
                                        selectedTeams={selectedTeams}
                                        showScores={showScores}
                                        fetchState={fetchState}
                                        startDate={seasonStartDate}
                                        endDate={seasonEndDate}>
                    </ScheduleCalendar>
                }
            </>
        }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp}
                     title={"Help"}
                     components={[
                         <VenueLegend selectedTeams={selectedTeams}></VenueLegend>,
                         <p>After selecting a season and a team, click on a game to view game information.</p>,
                         <Legend showTable={showTable}></Legend>
                     ]}>
        </SidebarHelp>
    </>;
}

export default Schedule;
