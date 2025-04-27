import PlayerContent from "./components/content/PlayerContent";

function PlayerDialog({dialogReference, selectedPlayer, fetchState}) {

    function resetDialogOnEscape(event) {
        if (event.key === "Escape") {
            closeDialog();
        }
    }

    function closeDialog() {
        dialogReference.current.scrollTo({top: 0, left: 0, behavior: "instant"});
        dialogReference.current.close();
    }

    return <dialog ref={dialogReference}
                   aria-label={"Player information"}
                   tabIndex={-1}
                   onKeyDown={resetDialogOnEscape}>
        <PlayerContent selectedPlayer={selectedPlayer}
                       fetchState={fetchState}
                       closeDialog={closeDialog}>
        </PlayerContent>
    </dialog>;
}

export default PlayerDialog;
