import {useEffect, useState} from "react";
import constants from "../../../data/constants.json";
import Atom from "../../shared/animations/atom/Atom.jsx";
import ErrorDialog from "../../shared/errors/ErrorDialog.jsx";
import MainContent from "../../shared/main/MainContent.jsx";
import SidebarHelp from "../../shared/sidebar/SidebarHelp.jsx";
import SidebarOptions from "../../shared/sidebar/SidebarOptions.jsx";
// import HTMLParser from "html-react-parser";
import "./Awards.css";

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
        setShowOptions(false);
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
                <div className={"homeHeader"}>
                    <span>Season Awards</span>
                </div>
                {
                    fetchState === constants.fetchState.error
                    ? <ErrorDialog errorMessage={"Failed to fetch award information."}></ErrorDialog>
                    : fetchState === constants.fetchState.loading
                      ? <Atom></Atom>
                      : <div className={"trophies"}>
                          {
                              trophies.map(trophy =>
                                  <button key={trophy.id}
                                          type={"button"}
                                          className={"horizontalFlex trophy"}
                                          title={"Show trophy details"}>
                                      <img className={"trophyImage"} src={trophy.imageUrl} alt={trophy.name}/>
                                      <div className={"verticalFlex trophyInformation"}>
                                          <span className={"trophyName"}>{trophy.name}</span>
                                          <span>{trophy.briefDescription}</span>
                                          {/*<span>{HTMLParser(trophy.description)}</span>*/}
                                      </div>
                                  </button>
                              )
                          }
                      </div>
                }
            </>
        }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp} title={"Help"}></SidebarHelp>
    </>;
}

export default SeasonAwards;
