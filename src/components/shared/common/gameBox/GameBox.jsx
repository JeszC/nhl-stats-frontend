import {isGameLive} from "../../../../scripts/utils.js";
import constants from "../../../../data/constants.json";

function GameBox({game, onClick, gameDate, isScorable = false}) {

    return <button type={"button"}
                   className={"verticalFlex individualGame"}
                   title={"Show game details"}
                   onClick={() => onClick ? onClick(game.id) : null}>
        <div className={"horizontalFlex gameAndDate"}>
            <img className={`gameBoxImage default ${game.awayTeam.abbrev} gradient`}
                 src={game.awayTeam.logo}
                 alt={`${game.awayTeam.abbrev} logo`}/>
            <div className={"verticalFlex gameStateAndTeamInformation"}>
                {
                    isGameLive(game.gameState)
                    ? <span className={"todayGameInformation"}>LIVE</span>
                    : null
                }
                <div className={"horizontalFlex teamInformation"}>
                    <span className={"todayGameInformation"}>{game.awayTeam.abbrev}</span>
                    {
                        isScorable
                        ? <>
                            {
                                isGameLive(game.gameState)
                                ? null
                                : <span className={"todayGameInformation"}>
                                    {
                                        game.awayTeam.score === undefined
                                        ? null
                                        : game.awayTeam.score.toLocaleString()
                                    }
                                </span>
                            }
                            <span className={"todayGameInformation"}>-</span>
                            {
                                isGameLive(game.gameState)
                                ? null
                                : <span className={"todayGameInformation"}>
                                    {
                                        game.homeTeam.score === undefined
                                        ? null
                                        : game.homeTeam.score.toLocaleString()
                                    }
                                </span>
                            }
                        </>
                        : <span className={"todayGameInformation"}>-</span>
                    }
                    <span className={"todayGameInformation"}>{game.homeTeam.abbrev}</span>
                </div>
            </div>
            <img className={`gameBoxImage default ${game.homeTeam.abbrev} gradient`}
                 src={game.homeTeam.logo}
                 alt={`${game.homeTeam.abbrev} logo`}/>
        </div>
        <div className={"verticalFlex dateTimeInformation"}>
            <span>
                {
                    game.gameScheduleState === constants.scheduleState.toBeDetermined
                    ? "TBD"
                    : gameDate
                      ? gameDate
                      : new Date(game.startTimeUTC).toLocaleString([], {
                            weekday: "long",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                }
            </span>
            <span>{game.venue.default}</span>
        </div>
    </button>;
}

export default GameBox;
