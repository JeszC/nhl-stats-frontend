import {useState} from "react";
import constants from "../../../../data/constants.json";
import PlayerContent from "../player/components/PlayerContent.jsx";
import DialogContent from "../shared/DialogContent.jsx";
import Trophy from "./components/body/Trophy.jsx";
import Header from "./components/header/Header.jsx";

function AwardDialog({dialogReference, trophy, trophyWinners, fetchState, setFetchState}) {
    const [activeView, setActiveView] = useState(constants.dialogViews.award);
    const [player, setPlayer] = useState({});

    function resetDialogOnEscape(event) {
        if (event.key === "Escape") {
            backToDefaultView();
            closeDialog();
        }
    }

    function backToDefaultView() {
        setActiveView(constants.dialogViews.award);
        setFetchState(constants.fetchState.finished);
    }

    function closeDialog() {
        setPlayer({});
        setActiveView(constants.dialogViews.award);
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
                   aria-label={"Trophy information"}
                   tabIndex={-1}
                   onKeyDown={resetDialogOnEscape}>
        {
            activeView === constants.dialogViews.award
            ? renderContent(
                <DialogContent fetchState={fetchState}
                               closeDialog={closeDialog}
                               headerData={<Header trophy={trophy}></Header>}
                               bodyData={
                                   <Trophy trophy={trophy}
                                           trophyWinners={trophyWinners}
                                           setPlayer={setPlayer}
                                           setFetchState={setFetchState}
                                           setActiveView={setActiveView}>
                                   </Trophy>
                               }>
                </DialogContent>
            )
            : activeView === constants.dialogViews.player
              ? renderContent(
                    <PlayerContent selectedPlayer={player}
                                   fetchState={fetchState}
                                   closeDialog={closeDialog}
                                   onBack={backToDefaultView}>
                    </PlayerContent>
                )
              : null
        }
    </dialog>;
}

export default AwardDialog;
