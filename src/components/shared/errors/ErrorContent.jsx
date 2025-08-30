function ErrorContent({errorMessage, subErrors}) {

    return <>
        <h4>{errorMessage.length === 0 ? "Error occurred" : errorMessage}</h4>
        {
            subErrors && subErrors.length > 0
            ? <div className={"verticalFlex suberrors"}>
                {
                    subErrors?.map((subError, index) =>
                        <span key={subError.message + index.toString()}>{subError.message}</span>
                    )
                }
            </div>
            : null
        }
    </>;
}

export default ErrorContent;
