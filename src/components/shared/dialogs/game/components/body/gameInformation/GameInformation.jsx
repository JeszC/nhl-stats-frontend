import constants from "../../../../../../../data/constants.json";
import {getGameType, getPeriodTitle, parseTime} from "../../../../../../../scripts/parsing.js";
import {getVideoURL, isGameFinished, isGameLive, isGameUpcoming} from "../../../../../../../scripts/utils.js";
import playIcon from "../../../images/Play.svg";

function GameInformation({game}) {

    function getGameEndType() {
        let periods = game.summary.linescore.byPeriod;
        if (periods && periods.length > 0) {
            let lastPeriod = periods[periods.length - 1];
            switch (lastPeriod.periodDescriptor.periodType) {
                case "SO":
                    return "Final/SO";
                case "OT":
                    return "Final/OT";
                default:
                    return "Final";
            }
        }
        return "Final";
    }

    return <>
        {
            game.specialEvent
            ? <div className={"eventBanner"}>
                <img className={"eventBannerImage"}
                     src={game.specialEvent.lightLogoUrl?.default}
                     alt={game.specialEvent.name?.default ? game.specialEvent.name.default : "Special event"}/>
            </div>
            : null
        }
        <div className={"horizontalFlex gameInformationBanner"}>
            <div className={`horizontalFlex singleTeam awayTeam default ${game.awayTeam.abbrev} gradient`}>
                <img className={"teamLogo"} src={game.awayTeam.logo} alt={`${game.awayTeam.abbrev} logo`}/>
                <div className={"verticalFlex teamOrGameInformation"}>
                    <span>{game.awayTeam.placeName.default}</span>
                    <span>{game.awayTeam.commonName.default}</span>
                </div>
                <span className={"teamScore"}>
                    {game.awayTeam.score === undefined ? null : game.awayTeam.score.toLocaleString()}
                </span>
            </div>
            <div className={"verticalFlex teamOrGameInformation gameInformation"}>
                {
                    isGameUpcoming(game.gameState)
                    ? <span>Upcoming</span>
                    : isGameLive(game.gameState)
                      ? <>
                          <span>LIVE</span>
                          <span>
                              {
                                  `${getPeriodTitle(game.gameType,
                                      game.periodDescriptor.number,
                                      game.periodDescriptor.otPeriods
                                  )}${game.clock.inIntermission
                                      ? " intermission"
                                      : `, ${parseTime(game.clock.timeRemaining)}`
                                  }`
                              }
                          </span>
                      </>
                      : <span>{getGameEndType()}</span>
                }
                <span>{getGameType(game)}</span>
                <span>
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
                </span>
                <span>{game.venue.default}, {game.venueLocation.default}</span>
                {
                    isGameFinished(game.gameState) && game?.gameVideo?.condensedGame
                    ? <div className={"horizontalFlex gameLinks"}>
                        <img className={"playButton zoom"}
                             src={playIcon}
                             alt={"Play button icon"}/>
                        <a target={"_blank"}
                           rel={"noopener noreferrer"}
                           href={getVideoURL(game.gameVideo.condensedGame)}
                           title={"Condensed game"}>
                            Condensed game
                        </a>
                    </div>
                    : null
                }
                {
                    isGameFinished(game.gameState) && game?.gameVideo?.threeMinRecap
                    ? <div className={"horizontalFlex gameLinks"}>
                        <img className={"playButton zoom"}
                             src={playIcon}
                             alt={"Play button icon"}/>
                        <a target={"_blank"}
                           rel={"noopener noreferrer"}
                           href={getVideoURL(game.gameVideo.threeMinRecap)}
                           title={"Game recap"}>
                            Game recap
                        </a>
                    </div>
                    : null
                }
            </div>
            <div className={`horizontalFlex singleTeam homeTeam default ${game.homeTeam.abbrev} gradient`}>
                <span className={"teamScore"}>
                    {game.homeTeam.score === undefined ? null : game.homeTeam.score.toLocaleString()}
                </span>
                <div className={"verticalFlex teamOrGameInformation"}>
                    <span>{game.homeTeam.placeName.default}</span>
                    <span>{game.homeTeam.commonName.default}</span>
                </div>
                <img className={"teamLogo"} src={game.homeTeam.logo} alt={`${game.homeTeam.abbrev} logo`}/>
            </div>
        </div>
    </>;
}

export default GameInformation;
