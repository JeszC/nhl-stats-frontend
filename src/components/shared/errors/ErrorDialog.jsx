function ErrorDialog({errorMessage, containsLink = false}) {
    return <div className={"error"}>
        <h4>Error occurred</h4>
        {containsLink ? <>{errorMessage}</> : <span>{errorMessage}</span>}
    </div>;
}

export default ErrorDialog;
