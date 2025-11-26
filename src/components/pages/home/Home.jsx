import {Fragment, useCallback, useEffect, useState} from "react";
import constants from "../../../data/constants.json";
import {fetchDataAndHandleErrors, getResponseData} from "../../../scripts/utils.js";
import Atom from "../../shared/animations/atom/Atom";
import PlayoffTree from "../../shared/common/playoffTree/PlayoffTree";
import ErrorDialogRetry from "../../shared/errors/ErrorDialogRetry";
import MainContent from "../../shared/main/MainContent.jsx";
import SidebarHelp from "../../shared/sidebar/SidebarHelp";
import SidebarOptions from "../../shared/sidebar/SidebarOptions";
import Injuries from "./components/Injuries.jsx";
import Legend from "./components/Legend";
import Signings from "./components/Signings.jsx";
import TableOfContents from "./components/TableOfContents.jsx";
import TopPlayers from "./components/TopPlayers";
import TopTeams from "./components/TopTeams";
import Trades from "./components/Trades.jsx";
import UpcomingGames from "./components/UpcomingGames";
import "./Home.css";

function Home({showOptions, setShowOptions, showHelp}) {
    const [games, setGames] = useState([]);
    const [skaters, setSkaters] = useState([]);
    const [goalies, setGoalies] = useState([]);
    const [teams, setTeams] = useState([]);
    const [playoffTree, setPlayoffTree] = useState({});
    const [injuries, setInjuries] = useState([]);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [errorMessage, setErrorMessage] = useState("");
    const [subErrors, setSubErrors] = useState([]);

    function getLocalDateString(dateString) {
        let gameDate = new Date(dateString);
        let year = gameDate.getFullYear();
        let month = (gameDate.getMonth() + 1).toString().padStart(2, "0");
        let date = gameDate.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${date}`;
    }

    const getUpcomingGames = useCallback(async () => {
        let todayLosAngeles = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        let todayDateString = getLocalDateString(todayLosAngeles);
        let upcomingGamesResponse = await fetch(`${constants.baseURL}/home/getUpcomingGames/${todayDateString}`);
        return await getResponseData(upcomingGamesResponse, "Error fetching upcoming games.");
    }, []);

    async function getTopTeams() {
        let teamResponse = await fetch(`${constants.baseURL}/home/getTopTen/teams`);
        return await getResponseData(teamResponse, "Error fetching top teams.");
    }

    async function getTopSkaters() {
        let skaterResponse = await fetch(`${constants.baseURL}/home/getTopTen/skaters`);
        return await getResponseData(skaterResponse, "Error fetching top skaters.");
    }

    async function getTopGoalies() {
        let goalieResponse = await fetch(`${constants.baseURL}/home/getTopTen/goalies`);
        return await getResponseData(goalieResponse, "Error fetching top goalies.");
    }

    async function getPlayoffTree() {
        let latestSeasonResponse = await fetch(`${constants.baseURL}/home/getLatestSeason`);
        let latestSeason = await getResponseData(latestSeasonResponse, "Error fetching latest season.");
        let playoffResponse = await fetch(`${constants.baseURL}/playoffs/getPlayoffTree/${latestSeason}`);
        try {
            return await getResponseData(playoffResponse, "Error fetching playoff tree.");
        } catch (ignored) {
            return {};
        }
    }

    async function getInjuries() {
        let injuryResponse = await fetch(`${constants.baseURL}/injuries/getInjuries`);
        return await getResponseData(injuryResponse, "Error fetching injuries.");
    }

    const getData = useCallback(async () => {
        setFetchState(constants.fetchState.loading);
        let responses = await Promise.all([
            getUpcomingGames(),
            getTopTeams(),
            getTopSkaters(),
            getTopGoalies(),
            getPlayoffTree(),
            getInjuries()
        ]);
        setGames(responses[0]);
        setTeams(responses[1]);
        setSkaters(responses[2]);
        setGoalies(responses[3]);
        setPlayoffTree(responses[4]);
        setInjuries(responses[5]);
        setFetchState(constants.fetchState.finished);
    }, [getUpcomingGames]);

    useEffect(() => {
        document.title = "Home";
        setShowOptions(false);
        fetchDataAndHandleErrors(getData, null, setErrorMessage, setSubErrors, setFetchState);
    }, [setShowOptions, getData]);

    return <>
        <SidebarOptions showSidebar={showOptions}
                        title={"Options"}
                        components={[<TableOfContents></TableOfContents>]}>
        </SidebarOptions>
        <MainContent showOptions={showOptions}
                     showHelp={showHelp}
                     content={
                         <>
                             <div className={"homeHeader"}>
                                 <span>Home</span>
                             </div>
                             {
                                 fetchState === constants.fetchState.loading ? <Atom></Atom> : null
                             }
                             {
                                 fetchState === constants.fetchState.error
                                 ? <ErrorDialogRetry
                                     onClick={() => fetchDataAndHandleErrors(getData,
                                         null,
                                         setErrorMessage,
                                         setSubErrors,
                                         setFetchState)
                                     }
                                     errorMessage={errorMessage}
                                     subErrors={subErrors}>
                                 </ErrorDialogRetry>
                                 : null
                             }
                             {
                                 fetchState === constants.fetchState.finished
                                 ? <>
                                     <UpcomingGames games={games}></UpcomingGames>
                                     <div id={"leaders"} className={"homePageTables"}>
                                         <TopTeams teams={teams}></TopTeams>
                                         <TopPlayers players={skaters}
                                                     headerText={"Top skaters"}>
                                         </TopPlayers>
                                         <TopPlayers players={goalies}
                                                     headerText={"Top goalies"}
                                                     areGoalies={true}>
                                         </TopPlayers>
                                     </div>
                                     <PlayoffTree playoffTree={playoffTree} fetchState={fetchState}></PlayoffTree>
                                     <div className={"horizontalFlex teamRosterEvents"}>
                                         <Injuries injuries={injuries} teams={teams}></Injuries>
                                         <Trades teams={teams}></Trades>
                                         <Signings teams={teams}></Signings>
                                     </div>
                                 </>
                                 : null
                             }
                         </>
                     }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp}
                     title={"Help"}
                     components={[<Legend></Legend>]}>
        </SidebarHelp>
    </>;
}

export default Home;
