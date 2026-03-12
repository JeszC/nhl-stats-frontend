import {useEffect, useRef, useState} from "react";
import constants from "../../../data/constants.json";
import {fetchDataAndHandleErrors, getResponseData} from "../../../scripts/utils.js";
import Bars from "../../shared/animations/bars/Bars.jsx";
import AwardDialog from "../../shared/dialogs/award/AwardDialog.jsx";
import ErrorDialogRetry from "../../shared/errors/ErrorDialogRetry.jsx";
import MainContent from "../../shared/main/MainContent.jsx";
import SidebarHelp from "../../shared/sidebar/SidebarHelp.jsx";
import SidebarOptions from "../../shared/sidebar/SidebarOptions.jsx";
import AwardGrid from "../awards/components/AwardGrid.jsx";
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
            fetchDataAndHandleErrors(
                () => getTrophyWinners(trophy.categoryId, trophy.id),
                result => {
                    setTrophyWinners(result);
                    setTrophyWinnerFetchState(constants.fetchState.finished);
                },
                setErrorMessage,
                setSubErrors,
                setTrophyWinnerFetchState
            );
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

    useEffect(() => {
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
    }, [setShowOptions]);

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
                      : <AwardGrid awards={trophies} openDialog={openDialog}></AwardGrid>
                }
                <AwardDialog dialogReference={dialog}
                             trophy={selectedTrophy}
                             trophyWinners={trophyWinners}
                             fetchState={trophyWinnerFetchState}>
                </AwardDialog>
            </>
        }>
        </MainContent>
        <SidebarHelp showSidebar={showHelp} title={"Help"}></SidebarHelp>
    </>;
}

export default SeasonAwards;
