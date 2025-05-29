import constants from "../../../../../../data/constants.json";
import {getGame, isGameLive} from "../../../../../../scripts/utils.js";

function Games({series, setGame, setFetchState, setActiveView}) {

    function getTeam(abbrev) {
        if (series.bottomSeedTeam.abbrev === abbrev) {
            return series.bottomSeedTeam;
        } else if (series.topSeedTeam.abbrev === abbrev) {
            return series.topSeedTeam;
        }
        return undefined;
    }

    return <>
        <div className={"verticalFlex playoffGamesInformation"}>
            {
                series && Object.keys(series).length > 0
                ? series?.games?.map(game =>
                    <button key={game.id}
                            className={"verticalFlex transparentButton playoffGameInformation"}
                            title={"Show game details"}
                            onClick={() => getGame(game.id, setGame, setFetchState, setActiveView)}>
                        <div className={"horizontalFlex playoffGameNumberAndTime"}>
                            <h4>Game {game.gameNumber.toLocaleString()}/{series.length.toLocaleString()}</h4>
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
                            <img src={getTeam(game.awayTeam.abbrev).logo} alt={`${series.bottomSeedTeam.abbrev} logo`}/>
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
                            <img src={getTeam(game.homeTeam.abbrev).logo} alt={`${series.topSeedTeam.abbrev} logo`}/>
                            <span className={"playoffGameTeam"}>{game.homeTeam.abbrev}</span>
                        </div>
                        <h4>Series</h4>
                        <div className={"horizontalFlex playoffGameResult"}>
                            <span className={"playoffGameTeam"}>{series.bottomSeedTeam.abbrev}</span>
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
                            <span className={"playoffGameTeam"}>{series.topSeedTeam.abbrev}</span>
                        </div>
                    </button>
                )
                : null
            }
        </div>
    </>;
}

export default Games;
