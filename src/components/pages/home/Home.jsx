import {Fragment, useCallback, useEffect, useState} from "react";
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
    const [visibleInjuries, setVisibleInjuries] = useState([]);
    const [trades, setTrades] = useState([]);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [injuryPage, setInjuryPage] = useState(0);
    const [tradePage, setTradePage] = useState(0);
    const [tradeFetchState, setTradeFetchState] = useState(constants.fetchState.loading);
    const [areAllTradesFetched, setAreAllTradesFetched] = useState(false);
    const numberOfItemsToFetch = 10;
    const tradeOffset = tradePage * numberOfItemsToFetch;
    const areAllInjuriesOnPage = visibleInjuries.length === injuries.length;

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

    const getTrades = useCallback(async () => {
        let tradesResponse = await fetch(`${constants.baseURL}/trades/getTrades/${tradeOffset}`);
        if (tradesResponse.ok) {
            return await tradesResponse.json();
        }
        throw new Error("HTTP error when fetching trades.");
    }, [tradeOffset]);

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
        setVisibleInjuries(responses[5].slice(0, numberOfItemsToFetch));
        setFetchState(constants.fetchState.finished);
    }

    function setUpOnLoad() {
        document.title = "Home";
        setShowOptions(false);
        getData().catch(() => setFetchState(constants.fetchState.error));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    useEffect(() => {
        if (!areAllTradesFetched) {
            setTradeFetchState(constants.fetchState.loading);
            getTrades()
                .then(fetchedTrades => {
                    setTrades(previousTrades => previousTrades.concat(fetchedTrades));
                    setTradeFetchState(constants.fetchState.finished);
                    if (fetchedTrades.length < numberOfItemsToFetch) {
                        setAreAllTradesFetched(true);
                    }
                })
                .catch(ignored => {
                    setTradeFetchState(constants.fetchState.error);
                });
        }
    }, [areAllTradesFetched, getTrades]);

    useEffect(() => {
        if (!areAllInjuriesOnPage) {
            setVisibleInjuries(injuries.slice(0, (injuryPage + 1) * numberOfItemsToFetch));
        }
    }, [injuries, injuryPage, areAllInjuriesOnPage]);

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
                                     onClick={() => getData().catch(() => setFetchState(constants.fetchState.error))}
                                     errorMessage={"Could not load data. Server might be offline."}>
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
                                     <div id={"injuriesTrades"} className={"horizontalFlex injuriesAndTrades"}>
                                         <Injuries injuries={visibleInjuries}
                                                   teams={teams}
                                                   areAllInjuriesOnPage={areAllInjuriesOnPage}
                                                   setInjuryPage={setInjuryPage}>
                                         </Injuries>
                                         <Trades trades={trades}
                                                 teams={teams}
                                                 areAllTradesFetched={areAllTradesFetched}
                                                 fetchState={tradeFetchState}
                                                 setTradePage={setTradePage}>
                                         </Trades>
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
