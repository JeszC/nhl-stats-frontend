import ErrorDialog from "./ErrorDialog";

function ErrorDialogSeasonUnstarted() {

    return <ErrorDialog containsLink={true} errorMessage={<>Season has not started.</>}></ErrorDialog>;
}

export default ErrorDialogSeasonUnstarted;
