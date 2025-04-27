import {useState} from "react";
import constants from "../../../../data/constants.json";
import GameContent from "../game/components/content/GameContent";
import PlayerContent from "../player/components/content/PlayerContent";
import PlayoffContent from "./components/PlayoffContent";

function PlayoffDialog({dialogReference, playoffSeries, fetchState, setFetchState}) {
    const [activeView, setActiveView] = useState("series");
    const [previousView, setPreviousView] = useState("series");
    const [game, setGame] = useState({});
    const [player, setPlayer] = useState({});

    function resetDialogOnEscape(event) {
        if (event.key === "Escape") {
            backToDefaultView();
            closeDialog();
        }
    }

    function backToDefaultView() {
        setPreviousView("series");
        setActiveView("series");
        setFetchState(constants.fetchState.finished);
    }

    function backToPreviousView() {
        if (previousView === "game") {
            setActiveView("game");
        } else {
            setActiveView("series");
        }
        setFetchState(constants.fetchState.finished);
    }

    function closeDialog() {
        setGame({});
        setPlayer({});
        setActiveView("series");
        dialogReference.current.scrollTo({top: 0, left: 0, behavior: "instant"});
        dialogReference.current.close();
    }

    function renderContent(content) {
        if (dialogReference && dialogReference.current) {
            dialogReference.current.scrollTo({top: 0, left: 0, behavior: "instant"});
        }
        return content;
    }

    return <dialog ref={dialogReference}
                   className={"playoffDialog"}
                   aria-label={"Playoff series information"}
                   tabIndex={-1}
                   onKeyDown={resetDialogOnEscape}>
        {
            activeView === "series"
            ? renderContent(
                <PlayoffContent setGame={setGame}
                                selectedSeries={playoffSeries}
                                fetchState={fetchState}
                                setFetchState={setFetchState}
                                closeDialog={closeDialog}
                                setActiveView={setActiveView}>
                </PlayoffContent>
            )
            : activeView === "game"
              ? renderContent(
                    <GameContent selectedGame={game}
                                 setPlayer={setPlayer}
                                 setActiveView={setActiveView}
                                 setPreviousView={setPreviousView}
                                 fetchState={fetchState}
                                 setFetchState={setFetchState}
                                 closeDialog={closeDialog}
                                 onBack={backToDefaultView}>
                    </GameContent>
                )
              : activeView === "player"
                ? renderContent(
                        <PlayerContent selectedPlayer={player}
                                       fetchState={fetchState}
                                       closeDialog={closeDialog}
                                       onBack={backToPreviousView}>
                        </PlayerContent>
                    )
                : null
        }
    </dialog>;
}

export default PlayoffDialog;
