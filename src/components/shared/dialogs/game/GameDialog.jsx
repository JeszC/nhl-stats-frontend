import {useEffect, useState} from "react";
import constants from "../../../../data/constants.json";
import PlayerContent from "../player/components/PlayerContent.jsx";
import GameContent from "./components/GameContent.jsx";
import "./Games.css";

function GameDialog({dialogReference, selectedGame, fetchState, setFetchState}) {
    const [activeView, setActiveView] = useState(constants.dialogViews.game);
    const [player, setPlayer] = useState({});

    function backToDefaultView() {
        setActiveView(constants.dialogViews.game);
        setFetchState(constants.fetchState.finished);
    }

    function resetDialogOnEscape(event) {
        if (event.key === "Escape") {
            closeDialog();
        }
    }

    function closeDialog() {
        setPlayer({});
        setActiveView(constants.dialogViews.game);
        dialogReference.current.scrollTo({top: 0, left: 0, behavior: "instant"});
        dialogReference.current.close();
    }

    useEffect(() => {
        if (dialogReference && dialogReference.current) {
            dialogReference.current.scrollTo({top: 0, left: 0, behavior: "instant"});
        }
    }, [activeView, dialogReference]);

    return <>
        <dialog ref={dialogReference} aria-label={"Game information"} tabIndex={-1} onKeyDown={resetDialogOnEscape}>
            {
                activeView === constants.dialogViews.game
                ? <GameContent selectedGame={selectedGame}
                               setPlayer={setPlayer}
                               setActiveView={setActiveView}
                               fetchState={fetchState}
                               setFetchState={setFetchState}
                               closeDialog={closeDialog}>
                </GameContent>
                : activeView === constants.dialogViews.player
                  ? <PlayerContent selectedPlayer={player}
                                   fetchState={fetchState}
                                   closeDialog={closeDialog}
                                   onBack={backToDefaultView}>
                  </PlayerContent>
                  : null
            }
        </dialog>
    </>;
}

export default GameDialog;
