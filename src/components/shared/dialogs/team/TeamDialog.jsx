import {useEffect, useState} from "react";
import constants from "../../../../data/constants.json";
import GameContent from "../game/components/GameContent.jsx";
import PlayerContent from "../player/components/PlayerContent.jsx";
import TeamContent from "./components/TeamContent.jsx";
import "./Teams.css";

function TeamDialog({dialogReference, selectedTeam, fetchState, setFetchState}) {
    const [activeView, setActiveView] = useState(constants.dialogViews.team);
    const [previousView, setPreviousView] = useState(constants.dialogViews.team);
    const [game, setGame] = useState({});
    const [player, setPlayer] = useState({});

    function resetDialogOnEscape(event) {
        if (event.key === "Escape") {
            backToDefaultView();
            closeDialog();
        }
    }

    function backToDefaultView() {
        setPreviousView(constants.dialogViews.team);
        setActiveView(constants.dialogViews.team);
        setFetchState(constants.fetchState.finished);
    }

    function backToPreviousView() {
        if (previousView === constants.dialogViews.game) {
            setActiveView(constants.dialogViews.game);
        } else {
            setActiveView(constants.dialogViews.team);
        }
        setFetchState(constants.fetchState.finished);
    }

    function closeDialog() {
        setGame({});
        setPlayer({});
        setActiveView(constants.dialogViews.team);
        dialogReference.current.scrollTo({top: 0, left: 0, behavior: "instant"});
        dialogReference.current.close();
    }

    useEffect(() => {
        if (dialogReference && dialogReference.current) {
            dialogReference.current.scrollTo({top: 0, left: 0, behavior: "instant"});
        }
    }, [activeView, dialogReference]);

    return <dialog ref={dialogReference} aria-label={"Team information"} tabIndex={-1} onKeyDown={resetDialogOnEscape}>
        {
            activeView === constants.dialogViews.team
            ? <TeamContent setGame={setGame}
                           setPlayer={setPlayer}
                           selectedTeam={selectedTeam}
                           fetchState={fetchState}
                           closeDialog={closeDialog}
                           setActiveView={setActiveView}
                           setFetchState={setFetchState}>
            </TeamContent>
            : activeView === constants.dialogViews.game
              ? <GameContent selectedGame={game}
                             setPlayer={setPlayer}
                             setActiveView={setActiveView}
                             setPreviousView={setPreviousView}
                             fetchState={fetchState}
                             setFetchState={setFetchState}
                             closeDialog={closeDialog}
                             onBack={backToDefaultView}>
              </GameContent>
              : activeView === constants.dialogViews.player
                ? <PlayerContent selectedPlayer={player}
                                 fetchState={fetchState}
                                 closeDialog={closeDialog}
                                 onBack={backToPreviousView}>
                </PlayerContent>
                : null
        }
    </dialog>;
}

export default TeamDialog;
