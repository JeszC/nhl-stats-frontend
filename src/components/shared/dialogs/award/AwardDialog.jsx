import HTMLParser from "html-react-parser";
import {useState} from "react";
import constants from "../../../../data/constants.json";
import {parseSeason} from "../../../../scripts/parsing.js";
import DialogContent from "../shared/DialogContent.jsx";
import Header from "./components/Header.jsx";

function AwardDialog({dialogReference, trophy, trophyWinners, fetchState, setFetchState}) {
    const [activeView, setActiveView] = useState(constants.dialogViews.award);
    const [previousView, setPreviousView] = useState(constants.dialogViews.award);
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
                                   <>
                                       {
                                           trophy.description ? <span>{HTMLParser(trophy.description)}</span> : null
                                       }
                                       {
                                           trophyWinners?.map(winner =>
                                               <p key={winner.id}>
                                                   {parseSeason(winner.seasonId)},
                                                   {winner.fullName},
                                                   {winner.team.fullName},
                                                   {winner.status}
                                               </p>
                                           )
                                       }
                                   </>
                               }>
                </DialogContent>
            )
            : activeView === constants.dialogViews.player
              ? renderContent(
                    <DialogContent fetchState={fetchState}
                                   closeDialog={closeDialog}
                                   headerData={<span>Player here</span>}
                                   bodyData={<h1>Player here</h1>}>
                    </DialogContent>
                )
              : null
        }
    </dialog>;
}

export default AwardDialog;
