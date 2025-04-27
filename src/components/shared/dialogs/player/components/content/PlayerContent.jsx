import {useEffect, useRef} from "react";
import constants from "../../../../../../data/constants.json";
import {getPlayerFullName} from "../../../../../../scripts/parsing.js";
import Slider from "../../../../animations/slider/Slider";
import ErrorDialog from "../../../../errors/ErrorDialog";
import BackButtonIcon from "../../../../images/Back.svg";
import CloseButtonIcon from "../../../../images/Close.svg";
import Awards from "./components/Awards";
import Biography from "./components/Biography";
import LastFiveGames from "./components/LastFiveGames";
import PlayerInformation from "./components/PlayerInformation";
import SeasonHistory from "./components/SeasonHistory";
import CareerStatistics from "./components/CareerStatistics.jsx";

function PlayerContent({selectedPlayer, fetchState, closeDialog, onBack}) {
    const backButton = useRef(null);

    function setUpOnLoad() {
        if (backButton.current) {
            backButton.current.focus();
        }
    }

    useEffect(setUpOnLoad, []);

    return <>
        <div className={"horizontalFlex gamesSummary"}>
            <button ref={backButton}
                    type={"button"}
                    className={"transparentButton dialogLeftElement"}
                    title={"Back"}
                    disabled={onBack === undefined}
                    onClick={onBack}>
                <img className={"icon"} src={BackButtonIcon} alt={"Back button icon"}/>
            </button>
            {
                fetchState === constants.fetchState.loading
                ? <span>Loading...</span>
                : fetchState === constants.fetchState.error
                  ? <span>Error loading player information.</span>
                  : Object.keys(selectedPlayer).length > 0
                    ? <>
                        <img className={`defaultImage headerImage default ${selectedPlayer.currentTeamAbbrev} gradient`}
                             src={selectedPlayer.headshot}
                             alt={`${getPlayerFullName(selectedPlayer)} headshot`}/>
                        <span>{getPlayerFullName(selectedPlayer)}</span>
                    </>
                    : null
            }
            <button type={"button"}
                    className={"transparentButton dialogRightElement"}
                    title={"Close"}
                    onClick={closeDialog}>
                <img className={"icon"} src={CloseButtonIcon} alt={"Close button icon"}/>
            </button>
        </div>
        {
            fetchState === constants.fetchState.loading
            ? <Slider></Slider>
            : fetchState === constants.fetchState.error
              ? <ErrorDialog errorMessage={"Could not load player information. Server might be offline."}></ErrorDialog>
              : Object.keys(selectedPlayer).length > 0
                ? <>
                    <PlayerInformation player={selectedPlayer}></PlayerInformation>
                    <CareerStatistics player={selectedPlayer}></CareerStatistics>
                    <Awards player={selectedPlayer}></Awards>
                    <Biography player={selectedPlayer}></Biography>
                    <LastFiveGames player={selectedPlayer}></LastFiveGames>
                    <SeasonHistory player={selectedPlayer}></SeasonHistory>
                </>
                : null
        }
    </>;
}

export default PlayerContent;
