import React, {useEffect, useRef, useState} from "react";
import constants from "../../../data/constants.json";
import Bars from "../../shared/animations/bars/Bars";
import GameDialog from "../../shared/dialogs/game/GameDialog";
import ErrorDialogRetry from "../../shared/errors/ErrorDialogRetry";
import MainContent from "../../shared/main/MainContent.jsx";
import SidebarHelp from "../../shared/sidebar/SidebarHelp";
import SidebarOptions from "../../shared/sidebar/SidebarOptions";
import DateGames from "./components/DateGames";
import "./Results.css";

function Results({showOptions, setShowOptions, showHelp}) {
    const [results, setResults] = useState([]);
    const [selectedGame, setSelectedGame] = useState({});
    const [fetchState, setFetchState] = useState(constants.fetchState.finished);
    const [gameFetchState, setGameFetchState] = useState(constants.fetchState.finished);
    const dialog = useRef(null);
    const daysToFetch = 7;
    const daysToShow = 5;

    async function openDialog(gameID) {
        setSelectedGame({});
        if (gameID) {
            setGameFetchState(constants.fetchState.loading);
            dialog.current.showModal();
            try {
                let response = await fetch(`${constants.baseURL}/schedule/getGame/${gameID}`);
                if (response.ok) {
                    setSelectedGame(await response.json());
                    setGameFetchState(constants.fetchState.finished);
                }
            } catch (ignored) {
                setGameFetchState(constants.fetchState.error);
            }
        }
    }

    async function getResults(date) {
        let response = await fetch(`${constants.baseURL}/results/getResults/${date}`);
        if (response.ok) {
            return await response.json();
        }
        throw new Error("HTTP error when fetching results.");
    }

    function getLocalDateString(dateString) {
        let gameDate = new Date(dateString);
        let year = gameDate.getFullYear();
        let month = (gameDate.getMonth() + 1).toString().padStart(2, "0");
        let date = gameDate.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${date}`;
    }

    function getGameLocalDates(games) {
        let dates = [];
        for (let game of games) {
            let gameDate = getLocalDateString(game.startTimeUTC);
            if (!dates.includes(gameDate)) {
                dates.push(gameDate);
            }
        }
        return dates.slice(Math.max(dates.length - daysToShow, 0), dates.length);
    }

    function getResultsByLocalDate(games, dates) {
        let results = [];
        for (let date of dates) {
            let gameDate = {
                date,
                games: games.filter(game => getLocalDateString(game.startTimeUTC) === date)
            };
            results.push(gameDate);
        }
        return results;
    }

    function fetchResults() {
        let today = new Date();
        let startDate = new Date().setDate(today.getDate() - daysToFetch);
        setFetchState(constants.fetchState.loading);
        getResults(getLocalDateString(startDate))
            .then(result => {
                let games = result.filter(game => new Date(game.startTimeUTC) < today);
                let localDates = getGameLocalDates(games);
                let resultsByLocalDate = getResultsByLocalDate(games, localDates);
                setResults(resultsByLocalDate);
                setFetchState(constants.fetchState.finished);
            })
            .catch(() => setFetchState(constants.fetchState.error));
    }

    function setUpOnLoad() {
        document.title = "Game Results";
        setShowOptions(false);
        fetchResults();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <>
        <SidebarOptions showSidebar={showOptions} title={"Options"}></SidebarOptions>
        <MainContent showOptions={showOptions}
                     showHelp={showHelp}
                     content={
                         <>
                             {
                                 results.length === 0
                                 ? <div className={"homeHeader"}>
                                     <span>Game Results</span>
                                 </div>
                                 : null
                             }
                             {
                                 fetchState === constants.fetchState.loading
                                 ? <Bars></Bars>
                                 : fetchState === constants.fetchState.error
                                   ? <ErrorDialogRetry errorMessage={"Could not load game results. " +
                                                                     "Server might be offline."}
                                                       onClick={fetchResults}>
                                   </ErrorDialogRetry>
                                   : results.length === 0 && fetchState === constants.fetchState.finished
                                     ? <div className={"resultsPlaceholder"}>
                                         <h1>No games in the last {daysToFetch} days</h1>
                                         <span>See team schedules for earlier games</span>
                                     </div>
                                     : <div className={"results"}>
                                         {
                                             results.map(date =>
                                                 <DateGames key={date.date}
                                                            date={date}
                                                            openDialog={openDialog}></DateGames>
                                             )
                                         }
                                     </div>
                             }
                             <GameDialog dialogReference={dialog}
                                         selectedGame={selectedGame}
                                         fetchState={gameFetchState}
                                         setFetchState={setGameFetchState}>
                             </GameDialog>
                         </>
                     }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp}
                     title={"Help"}
                     components={[
                         <p>Click on a date to show the results for the games played on that date.</p>
                     ]}>
        </SidebarHelp>
    </>;
}

export default Results;
