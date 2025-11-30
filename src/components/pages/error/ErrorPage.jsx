import {useEffect} from "react";
import ErrorDialog from "../../shared/errors/ErrorDialog";

function ErrorPage() {

    useEffect(() => {
        document.title = "Page not found";
    }, []);

    return <>
        <ErrorDialog errorMessage={"Page not found"}></ErrorDialog>
    </>;
}

export default ErrorPage;
