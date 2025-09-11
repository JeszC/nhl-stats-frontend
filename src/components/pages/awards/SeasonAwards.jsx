import {useEffect, useRef, useState} from "react";
import constants from "../../../data/constants.json";
import {fetchDataAndHandleErrors, getResponseData} from "../../../scripts/utils.js";
import Bars from "../../shared/animations/bars/Bars.jsx";
import AwardDialog from "../../shared/dialogs/award/AwardDialog.jsx";
import ErrorDialogRetry from "../../shared/errors/ErrorDialogRetry.jsx";
import MainContent from "../../shared/main/MainContent.jsx";
import SidebarHelp from "../../shared/sidebar/SidebarHelp.jsx";
import SidebarOptions from "../../shared/sidebar/SidebarOptions.jsx";
import "./Awards.css";

function SeasonAwards({showOptions, setShowOptions, showHelp}) {
    const [trophies, setTrophies] = useState([]);
    const [selectedTrophy, setSelectedTrophy] = useState({});
    const [trophyWinners, setTrophyWinners] = useState([]);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [trophyWinnerFetchState, setTrophyWinnerFetchState] = useState(constants.fetchState.finished);
    const [errorMessage, setErrorMessage] = useState("");
    const [subErrors, setSubErrors] = useState([]);
    const dialog = useRef(null);

    async function openDialog(trophy) {
        setTrophyWinners([]);
        setSelectedTrophy(trophy);
        if (trophy) {
            setTrophyWinnerFetchState(constants.fetchState.loading);
            dialog.current.showModal();
            try {
                setTrophyWinners(await getTrophyWinners(trophy.categoryId, trophy.id));
                setTrophyWinnerFetchState(constants.fetchState.finished);
            } catch (ignored) {
                setTrophyWinnerFetchState(constants.fetchState.error);
            }
        }
    }

    async function getTrophies() {
        let response = await fetch(`${constants.baseURL}/awards/getTrophies`);
        return await getResponseData(response, "Error fetching trophies.");
    }

    async function getTrophyWinners(categoryID, trophyID) {
        let response = await fetch(`${constants.baseURL}/awards/getTrophyWinners/${categoryID}/${trophyID}`);
        return await getResponseData(response, "Error fetching trophy winners.");
    }

    function setUpOnLoad() {
        document.title = "Season Awards";
        setShowOptions(false);
        fetchDataAndHandleErrors(
            getTrophies,
            result => {
                setTrophies(result);
                setFetchState(constants.fetchState.finished);
            },
            setErrorMessage,
            setSubErrors,
            setFetchState);
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
                    ? <ErrorDialogRetry
                        onClick={() => fetchDataAndHandleErrors(
                            getTrophies,
                            result => {
                                setTrophies(result);
                                setFetchState(constants.fetchState.finished);
                            },
                            setErrorMessage,
                            setSubErrors,
                            setFetchState)
                        }
                        errorMessage={errorMessage}
                        subErrors={subErrors}>
                    </ErrorDialogRetry>
                    : fetchState === constants.fetchState.loading
                      ? <Bars></Bars>
                      : <div className={"trophies"}>
                          {
                              trophies.map(trophy =>
                                  <button key={trophy.id}
                                          type={"button"}
                                          className={"horizontalFlex trophy"}
                                          title={"Show trophy details"}
                                          onClick={() => openDialog(trophy)}>
                                      <img className={"trophyImageButton"} src={trophy.imageUrl} alt={trophy.name}/>
                                      <div className={"verticalFlex trophyInformation"}>
                                          <span className={"trophyName"}>{trophy.name}</span>
                                          <span>{trophy.briefDescription}</span>
                                      </div>
                                  </button>
                              )
                          }
                      </div>
                }
                <AwardDialog dialogReference={dialog}
                             trophy={selectedTrophy}
                             trophyWinners={trophyWinners}
                             fetchState={trophyWinnerFetchState}
                             setFetchState={setTrophyWinnerFetchState}>
                </AwardDialog>
            </>
        }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp} title={"Help"}></SidebarHelp>
    </>;
}

export default SeasonAwards;
