import {useEffect} from "react";
import ErrorDialog from "../../shared/errors/ErrorDialog";

function ErrorPage() {

    function setUpOnLoad() {
        document.title = "Page not found";
    }

    useEffect(setUpOnLoad, []);

    return <>
        <ErrorDialog errorMessage={"Page not found"}></ErrorDialog>
    </>;
}

export default ErrorPage;
