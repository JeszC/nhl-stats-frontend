function ErrorDialogRetry({onClick, errorMessage}) {
    return <div className={"error"}>
        <h4>Error occurred</h4>
        <span>{errorMessage}</span>
        <button type={"button"} title={"Retry"} onClick={onClick}>Retry</button>
    </div>;
}

export default ErrorDialogRetry;
