import {useEffect, useState} from "react";
import constants from "../../../data/constants.json";
import Atom from "../../shared/animations/atom/Atom.jsx";
import ErrorDialog from "../../shared/errors/ErrorDialog.jsx";
import MainContent from "../../shared/main/MainContent.jsx";
import SidebarHelp from "../../shared/sidebar/SidebarHelp.jsx";
import SidebarOptions from "../../shared/sidebar/SidebarOptions.jsx";

function SeasonAwards({showOptions, setShowOptions, showHelp}) {
    const [trophies, setTrophies] = useState([]);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);

    async function getTrophies() {
        let response = await fetch(`${constants.baseURL}/awards/getTrophies`);
        if (response.ok) {
            return await response.json();
        }
        throw new Error("HTTP error when fetching trophies");
    }

    function setUpOnLoad() {
        document.title = "Season Awards";
        setShowOptions(true);
        getTrophies()
            .then(result => {
                setTrophies(result);
                setFetchState(constants.fetchState.finished);
            })
            .catch(ignored => setFetchState(constants.fetchState.error));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <>
        <SidebarOptions showSidebar={showOptions} title={"Options"}></SidebarOptions>
        <MainContent showOptions={showOptions} showHelp={showHelp} content={
            <>
                <h1>Season Awards</h1>
                {
                    fetchState === constants.fetchState.error
                    ? <ErrorDialog errorMessage={"Failed to fetch award information."}></ErrorDialog>
                    : fetchState === constants.fetchState.loading
                      ? <Atom></Atom>
                      : trophies.map(trophy =>
                            <div key={trophy.id}>
                                <h3>{trophy.name} - {trophy.briefDescription}</h3>
                                <span>{trophy.description}</span>
                                <img src={trophy.imageUrl} alt={trophy.name}/>
                            </div>
                        )
                }
            </>
        }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp} title={"Help"}></SidebarHelp>
    </>;
}

export default SeasonAwards;
