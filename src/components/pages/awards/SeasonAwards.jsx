import {useEffect} from "react";
import MainContent from "../../shared/main/MainContent.jsx";
import SidebarHelp from "../../shared/sidebar/SidebarHelp.jsx";
import SidebarOptions from "../../shared/sidebar/SidebarOptions.jsx";

function SeasonAwards({showOptions, setShowOptions, showHelp}) {

    function setUpOnLoad() {
        document.title = "Season Awards";
        setShowOptions(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <>
        <SidebarOptions showSidebar={showOptions} title={"Options"}></SidebarOptions>
        <MainContent showOptions={showOptions} showHelp={showHelp} content={
            <>
                <h1>Season Awards</h1>
            </>
        }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp} title={"Help"}></SidebarHelp>
    </>;
}

export default SeasonAwards;
