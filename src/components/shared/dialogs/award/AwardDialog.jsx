import DialogContent from "../shared/DialogContent.jsx";
import Trophy from "./components/body/Trophy.jsx";
import Header from "./components/header/Header.jsx";

function AwardDialog({dialogReference, trophy, trophyWinners, fetchState}) {

    function resetDialogOnEscape(event) {
        if (event.key === "Escape") {
            closeDialog();
        }
    }

    function closeDialog() {
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
            renderContent(
                <DialogContent fetchState={fetchState}
                               closeDialog={closeDialog}
                               headerData={<Header trophy={trophy}></Header>}
                               bodyData={<Trophy trophy={trophy} trophyWinners={trophyWinners}></Trophy>}>
                </DialogContent>
            )
        }
    </dialog>;
}

export default AwardDialog;
