import ErrorDialog from "./ErrorDialog";

function ErrorDialogLockout() {

    return <ErrorDialog errorMessage={
        <>
            No games due to&nbsp;
            <a target={"_blank"}
               rel={"noopener noreferrer"}
               href={"https://en.wikipedia.org/wiki/2004%E2%80%9305_NHL_lockout"}
               title={"NHL lockout"}>
                NHL lockout
            </a>
        </>
    }>
    </ErrorDialog>;
}

export default ErrorDialogLockout;
