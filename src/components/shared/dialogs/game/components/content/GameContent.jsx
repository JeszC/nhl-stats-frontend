import {useEffect, useRef} from "react";
import constants from "../../../../../../data/constants.json";
import {isGameUpcoming} from "../../../../../../scripts/utils.js";
import Slider from "../../../../animations/slider/Slider";
import ErrorDialog from "../../../../errors/ErrorDialog";
import BackButtonIcon from "../../../../images/Back.svg";
import CloseButtonIcon from "../../../../images/Close.svg";
import PlayedGames from "./components/playedGames/PlayedGames.jsx";
import GameInformation from "./components/shared/GameInformation.jsx";
import UpcomingGames from "./components/upcomingGames/UpcomingGames.jsx";

function GameContent({
                         selectedGame,
                         setPlayer,
                         setActiveView,
                         setPreviousView,
                         fetchState,
                         setFetchState,
                         closeDialog,
                         onBack
                     }) {
    const backButton = useRef(null);

    function setUpOnLoad() {
        if (backButton.current) {
            backButton.current.focus();
        }
    }

    useEffect(setUpOnLoad, []);

    return <>
        <div className={"horizontalFlex gamesSummary"}>
            <button ref={backButton}
                    type={"button"}
                    className={"transparentButton dialogLeftElement"}
                    title={"Back"}
                    disabled={onBack === undefined}
                    onClick={onBack}>
                <img className={"icon"} src={BackButtonIcon} alt={"Back button icon"}/>
            </button>
            {
                fetchState === constants.fetchState.loading
                ? <span>Loading...</span>
                : fetchState === constants.fetchState.error
                  ? <span>Error loading game information.</span>
                  : Object.keys(selectedGame).length > 0
                    ? <>
                        <img className={`defaultImage headerImage default ${selectedGame.awayTeam.abbrev} gradient`}
                             src={selectedGame.awayTeam.logo}
                             alt={`${selectedGame.awayTeam.abbrev} logo`}/>
                        <h1 className={"teamAbbreviation"}>
                            {selectedGame.awayTeam.abbrev} - {selectedGame.homeTeam.abbrev}
                        </h1>
                        <img className={`defaultImage headerImage default ${selectedGame.homeTeam.abbrev} gradient`}
                             src={selectedGame.homeTeam.logo}
                             alt={`${selectedGame.homeTeam.abbrev} logo`}/>
                    </>
                    : null
            }
            <button type={"button"}
                    className={"transparentButton dialogRightElement"}
                    title={"Close"}
                    onClick={closeDialog}>
                <img className={"icon"} src={CloseButtonIcon} alt={"Close button icon"}/>
            </button>
        </div>
        {
            fetchState === constants.fetchState.loading
            ? <Slider></Slider>
            : fetchState === constants.fetchState.error
              ? <ErrorDialog errorMessage={"Could not load game information. Server might be offline."}></ErrorDialog>
              : Object.keys(selectedGame).length > 0
                ? <>
                    <GameInformation game={selectedGame}></GameInformation>
                    {
                        isGameUpcoming(selectedGame.gameState)
                        ? <UpcomingGames game={selectedGame}
                                         setPlayer={setPlayer}
                                         setActiveView={setActiveView}
                                         setPreviousView={setPreviousView}
                                         setFetchState={setFetchState}>
                        </UpcomingGames>
                        : <>
                            <PlayedGames game={selectedGame}
                                         setPlayer={setPlayer}
                                         setActiveView={setActiveView}
                                         setPreviousView={setPreviousView}
                                         setFetchState={setFetchState}>
                            </PlayedGames>
                        </>
                    }
                </>
                : null
        }
    </>;
}

export default GameContent;
