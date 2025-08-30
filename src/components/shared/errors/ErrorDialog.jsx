import ErrorContent from "./ErrorContent.jsx";

function ErrorDialog({errorMessage, subErrors}) {
    return <div className={"error"}>
        <ErrorContent errorMessage={errorMessage} subErrors={subErrors}></ErrorContent>
    </div>;
}

export default ErrorDialog;
