import {Fragment, useEffect, useState} from "react";
import constants from "../../../data/constants.json";
import Atom from "../../shared/animations/atom/Atom";
import PlayoffTree from "../../shared/common/playoffTree/PlayoffTree";
import ErrorDialogRetry from "../../shared/errors/ErrorDialogRetry";
import MainContent from "../../shared/main/MainContent.jsx";
import SidebarHelp from "../../shared/sidebar/SidebarHelp";
import SidebarOptions from "../../shared/sidebar/SidebarOptions";
import Injuries from "./components/Injuries.jsx";
import Legend from "./components/Legend";
import TableOfContents from "./components/TableOfContents.jsx";
import TopPlayers from "./components/TopPlayers";
import TopTeams from "./components/TopTeams";
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

    function getLocalDateString(dateString) {
        let gameDate = new Date(dateString);
        let year = gameDate.getFullYear();
        let month = (gameDate.getMonth() + 1).toString().padStart(2, "0");
        let date = gameDate.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${date}`;
    }

    async function getUpcomingGames() {
        let todayLosAngeles = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        let todayDateString = getLocalDateString(todayLosAngeles);
        let upcomingGamesResponse = await fetch(`${constants.baseURL}/home/getUpcomingGames/${todayDateString}`);
        if (upcomingGamesResponse.ok) {
            return await upcomingGamesResponse.json();
        }
        throw new Error("HTTP error when fetching today's games.");
    }

    async function getTopTeams() {
        let teamResponse = await fetch(`${constants.baseURL}/home/getTopTen/teams`);
        if (teamResponse.ok) {
            return await teamResponse.json();
        }
        throw new Error("HTTP error when fetching top ten teams.");
    }

    async function getTopSkaters() {
        let skaterResponse = await fetch(`${constants.baseURL}/home/getTopTen/skaters`);
        if (skaterResponse.ok) {
            return await skaterResponse.json();
        }
        throw new Error("HTTP error when fetching top ten skaters.");
    }

    async function getTopGoalies() {
        let goalieResponse = await fetch(`${constants.baseURL}/home/getTopTen/goalies`);
        if (goalieResponse.ok) {
            return await goalieResponse.json();
        }
        throw new Error("HTTP error when fetching top ten goalies.");
    }

    async function getPlayoffTree() {
        let latestSeasonResponse = await fetch(`${constants.baseURL}/home/getLatestSeason`);
        if (latestSeasonResponse.ok) {
            let latestSeason = await latestSeasonResponse.json();
            let playoffResponse = await fetch(`${constants.baseURL}/playoffs/getPlayoffTree/${latestSeason}`);
            if (playoffResponse.ok) {
                try {
                    return await playoffResponse.json();
                } catch (ignored) {
                    return {};
                }
            }
            throw new Error("HTTP error when fetching playoff tree.");
        }
        throw new Error("HTTP error when fetching latest season.");
    }

    async function getInjuries() {
        let injuryResponse = await fetch(`${constants.baseURL}/injuries/getInjuries`);
        if (injuryResponse.ok) {
            return await injuryResponse.json();
        }
        throw new Error("HTTP error when fetching injuries.");
    }

    async function getData() {
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
    }

    function setUpOnLoad() {
        document.title = "Home";
        setShowOptions(false);
        getData().catch(() => setFetchState(constants.fetchState.error));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

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
                             {fetchState === constants.fetchState.loading ? <Atom></Atom> : null}
                             {
                                 fetchState === constants.fetchState.error
                                 ? <ErrorDialogRetry
                                     onClick={() => getData().catch(() => setFetchState(constants.fetchState.error))}
                                     errorMessage={"Could not load data. Server might be offline."}>
                                 </ErrorDialogRetry>
                                 : null
                             }
                             {
                                 fetchState === constants.fetchState.finished
                                 ? <>
                                     <UpcomingGames games={games}></UpcomingGames>
                                     <div className={"homePageTables"}>
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
                                     <Injuries injuries={injuries} teams={teams}></Injuries>
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
