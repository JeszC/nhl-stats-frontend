import constants from "../../../../../data/constants.json";
import {isGameLive} from "../../../../../scripts/utils.js";
import Slider from "../../../animations/slider/Slider";
import BackButtonIcon from "../../../images/Back.svg";
import CloseButtonIcon from "../../../images/Close.svg";

function PlayoffContent({setGame, selectedSeries, fetchState, setFetchState, closeDialog, setActiveView}) {

    async function getGame(gameID) {
        setFetchState(constants.fetchState.loading);
        setActiveView("game");
        try {
            let response = await fetch(`${constants.baseURL}/schedule/getGame/${gameID}`);
            if (response.ok) {
                setGame(await response.json());
                setFetchState(constants.fetchState.finished);
            } else {
                setFetchState(constants.fetchState.error);
            }
        } catch (ignored) {
            setFetchState(constants.fetchState.error);
        }
    }

    function getTeam(abbrev) {
        if (selectedSeries.bottomSeedTeam.abbrev === abbrev) {
            return selectedSeries.bottomSeedTeam;
        } else if (selectedSeries.topSeedTeam.abbrev === abbrev) {
            return selectedSeries.topSeedTeam;
        }
        return undefined;
    }

    return <>
        <div className={"horizontalFlex gamesSummary"}>
            <button type={"button"}
                    className={"transparentButton dialogLeftElement"}
                    title={"Back"}
                    disabled={true}>
                <img className={"icon"} src={BackButtonIcon} alt={"Back button icon"}/>
            </button>
            {
                fetchState === constants.fetchState.loading
                ? <span>Loading...</span>
                : fetchState === constants.fetchState.error
                  ? <span>Error loading series information.</span>
                  : selectedSeries && selectedSeries.bottomSeedTeam && selectedSeries.topSeedTeam
                    ? <h3>{selectedSeries.roundLabel}</h3>
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
            selectedSeries.seriesLogo
            ? <div className={"eventBanner"}>
                <img className={"eventBannerImage"} src={selectedSeries.seriesLogo} alt={"Series logo"}/>
            </div>
            : null
        }
        {
            selectedSeries && selectedSeries.bottomSeedTeam && selectedSeries.topSeedTeam
            ? <div className={"horizontalFlex playoffBanner"}>
                <div className={`horizontalFlex teamBackground default
                ${selectedSeries.bottomSeedTeam.abbrev} gradient`}>
                    <div className={"verticalFlex playoffBannerInformation"}>
                        <h4>{selectedSeries.bottomSeedTeam.abbrev}</h4>
                        <span className={"playoffScore"}>
                            {selectedSeries.bottomSeedTeam.seriesWins.toLocaleString()}
                        </span>
                    </div>
                    <img src={selectedSeries.bottomSeedTeam.logo} alt={`${selectedSeries.bottomSeedTeam.abbrev} logo`}/>
                </div>
                <div className={`horizontalFlex teamBackground default
                ${selectedSeries.topSeedTeam.abbrev} gradient`}>
                    <img src={selectedSeries.topSeedTeam.logo} alt={`${selectedSeries.topSeedTeam.abbrev} logo`}/>
                    <div className={"verticalFlex playoffBannerInformation"}>
                        <h4>{selectedSeries.topSeedTeam.abbrev}</h4>
                        <span className={"playoffScore"}>
                            {selectedSeries.topSeedTeam.seriesWins.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
            : null
        }
        <div className={"verticalFlex playoffGamesInformation"}>
            {fetchState === constants.fetchState.loading ? <Slider></Slider> : null}
            {
                selectedSeries && selectedSeries.games
                ? selectedSeries.games.map(game =>
                    <button key={game.id}
                            className={"verticalFlex transparentButton playoffGameInformation"}
                            title={"Show game details"}
                            onClick={() => getGame(game.id)}>
                        <div className={"horizontalFlex playoffGameNumberAndTime"}>
                            <h4>Game {game.gameNumber.toLocaleString()}/{selectedSeries.length.toLocaleString()}</h4>
                            <h4>
                                {
                                    game.gameScheduleState === constants.scheduleState.toBeDetermined
                                    ? "TBD"
                                    : new Date(game.startTimeUTC).toLocaleTimeString([], {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })
                                }
                            </h4>
                        </div>
                        <div className={"horizontalFlex playoffGameResult"}>
                            <span className={"playoffGameTeam"}>{game.awayTeam.abbrev}</span>
                            <img src={getTeam(game.awayTeam.abbrev).logo}
                                 alt={`${selectedSeries.bottomSeedTeam.abbrev} logo`}/>
                            <div className={"verticalFlex playoffGameState"}>
                                {
                                    isGameLive(game.gameState)
                                    ? <span>LIVE</span>
                                    : null
                                }
                                <div className={"horizontalFlex"}>
                                    {
                                        game.awayTeam.score === undefined
                                        ? null
                                        : <span className={"playoffGameScore"}>
                                            {game.awayTeam.score.toLocaleString()}
                                        </span>
                                    }
                                    <span className={"playoffGameSeparator"}> - </span>
                                    {
                                        game.homeTeam.score === undefined
                                        ? null
                                        : <span className={"playoffGameScore"}>
                                            {game.homeTeam.score.toLocaleString()}
                                        </span>
                                    }
                                </div>
                            </div>
                            <img src={getTeam(game.homeTeam.abbrev).logo}
                                 alt={`${selectedSeries.topSeedTeam.abbrev} logo`}/>
                            <span className={"playoffGameTeam"}>{game.homeTeam.abbrev}</span>
                        </div>
                        <h4>Series</h4>
                        <div className={"horizontalFlex playoffGameResult"}>
                            <span className={"playoffGameTeam"}>{selectedSeries.bottomSeedTeam.abbrev}</span>
                            <div className={"horizontalFlex"}>
                                {
                                    game.seriesStatus?.bottomSeedWins === undefined
                                    ? null
                                    : <span className={"playoffGameScore"}>
                                       {game.seriesStatus.bottomSeedWins.toLocaleString()}
                                    </span>
                                }
                                <span className={"playoffGameSeparator"}> - </span>
                                {
                                    game.seriesStatus?.topSeedWins === undefined
                                    ? null
                                    : <span className={"playoffGameScore"}>
                                       {game.seriesStatus.topSeedWins.toLocaleString()}
                                    </span>
                                }
                            </div>
                            <span className={"playoffGameTeam"}>{selectedSeries.topSeedTeam.abbrev}</span>
                        </div>
                    </button>
                )
                : null
            }
        </div>
    </>;
}

export default PlayoffContent;
