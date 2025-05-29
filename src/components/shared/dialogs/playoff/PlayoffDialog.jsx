import {useState} from "react";
import constants from "../../../../data/constants.json";
import GameContent from "../game/components/GameContent.jsx";
import PlayerContent from "../player/components/PlayerContent.jsx";
import PlayoffContent from "./components/PlayoffContent";

function PlayoffDialog({dialogReference, playoffSeries, fetchState, setFetchState}) {
    const [activeView, setActiveView] = useState(constants.dialogViews.playoff);
    const [previousView, setPreviousView] = useState(constants.dialogViews.playoff);
    const [game, setGame] = useState({});
    const [player, setPlayer] = useState({});

    function resetDialogOnEscape(event) {
        if (event.key === "Escape") {
            backToDefaultView();
            closeDialog();
        }
    }

    function backToDefaultView() {
        setPreviousView(constants.dialogViews.playoff);
        setActiveView(constants.dialogViews.playoff);
        setFetchState(constants.fetchState.finished);
    }

    function backToPreviousView() {
        if (previousView === constants.dialogViews.game) {
            setActiveView(constants.dialogViews.game);
        } else {
            setActiveView(constants.dialogViews.playoff);
        }
        setFetchState(constants.fetchState.finished);
    }

    function closeDialog() {
        setGame({});
        setPlayer({});
        setActiveView(constants.dialogViews.playoff);
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
            activeView === constants.dialogViews.playoff
            ? renderContent(
                <PlayoffContent setGame={setGame}
                                selectedSeries={playoffSeries}
                                fetchState={fetchState}
                                setFetchState={setFetchState}
                                closeDialog={closeDialog}
                                setActiveView={setActiveView}>
                </PlayoffContent>
            )
            : activeView === constants.dialogViews.game
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
              : activeView === constants.dialogViews.player
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
