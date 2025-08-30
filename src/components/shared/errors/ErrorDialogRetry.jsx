import ErrorContent from "./ErrorContent.jsx";

function ErrorDialogRetry({onClick, errorMessage, subErrors}) {

    return <div className={"verticalFlex error"}>
        <ErrorContent errorMessage={errorMessage} subErrors={subErrors}></ErrorContent>
        <button type={"button"} title={"Retry"} onClick={onClick}>Retry</button>
    </div>;
}

export default ErrorDialogRetry;
