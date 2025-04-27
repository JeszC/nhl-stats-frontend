import {useState} from "react";
import constants from "../../../../data/constants.json";
import GameContent from "../game/components/content/GameContent";
import PlayerContent from "../player/components/content/PlayerContent";
import TeamContent from "./components/content/TeamContent";
import "./Teams.css";

function TeamDialog({dialogReference, selectedTeam, fetchState, setFetchState}) {
    const [activeView, setActiveView] = useState("team");
    const [previousView, setPreviousView] = useState("team");
    const [game, setGame] = useState({});
    const [player, setPlayer] = useState({});

    function resetDialogOnEscape(event) {
        if (event.key === "Escape") {
            backToDefaultView();
            closeDialog();
        }
    }

    function backToDefaultView() {
        setPreviousView("team");
        setActiveView("team");
        setFetchState(constants.fetchState.finished);
    }

    function backToPreviousView() {
        if (previousView === "game") {
            setActiveView("game");
        } else {
            setActiveView("team");
        }
        setFetchState(constants.fetchState.finished);
    }

    function closeDialog() {
        setGame({});
        setPlayer({});
        setActiveView("team");
        dialogReference.current.scrollTo({top: 0, left: 0, behavior: "instant"});
        dialogReference.current.close();
    }

    function renderContent(content) {
        if (dialogReference && dialogReference.current) {
            dialogReference.current.scrollTo({top: 0, left: 0, behavior: "instant"});
        }
        return content;
    }

    return <dialog ref={dialogReference} aria-label={"Team information"} tabIndex={-1} onKeyDown={resetDialogOnEscape}>
        {
            activeView === "team"
            ? renderContent(
                <TeamContent setGame={setGame}
                             setPlayer={setPlayer}
                             selectedTeam={selectedTeam}
                             fetchState={fetchState}
                             closeDialog={closeDialog}
                             setActiveView={setActiveView}
                             setFetchState={setFetchState}>
                </TeamContent>
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

export default TeamDialog;
