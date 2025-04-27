import {getGameType} from "../../../../../../../../scripts/parsing.js";
import {isGameLive} from "../../../../../../../../scripts/utils.js";
import constants from "../../../../../../../../data/constants.json";

function Game({game, openDialog, showScores}) {

    function getClassName(gameOutcome) {
        return gameOutcome && gameOutcome.lastPeriodType !== "REG" ? "overtime" : "";
    }

    return <div className={"singleGame"}>
        <button type={"button"}
                className={"singleGameButton"}
                title={"Show game details"}
                onClick={() => openDialog(game.id)}>
            <div className={"verticalFlex"}>
                {isGameLive(game.gameState) ? <span className={"wrap"}>LIVE</span> : null}
                <span className={"wrap"}>
                    {
                        game.gameScheduleState === constants.scheduleState.toBeDetermined
                        ? "TBD"
                        : new Date(game.startTimeUTC).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }
                </span>
                <span className={"wrap gameVenue"}>{game.venue.default}</span>
                <span className={"wrap"}>{getGameType(game)}</span>
            </div>
            <div className={"horizontalFlex"}>
                <img className={"scheduleImage calendarImage"}
                     src={game.awayTeam.logo}
                     alt={`${game.awayTeam.abbrev} logo`}/>
                <img className={"scheduleImage calendarImage"}
                     src={game.homeTeam.logo}
                     alt={`${game.homeTeam.abbrev} logo`}/>
            </div>
            <div className={"horizontalFlex"}>
                <span className={"teamAbbreviation wrap"}>{game.awayTeam.abbrev}</span>
                <span className={"teamAbbreviation wrap"}>{game.homeTeam.abbrev}</span>
            </div>
            {
                showScores
                ? <div className={`horizontalFlex ${getClassName(game.gameOutcome)}`}>
                    <span className={"teamAbbreviation wrap"}>
                        {game.awayTeam.score === undefined ? "-" : game.awayTeam.score.toLocaleString()}
                    </span>
                    {
                        game.gameOutcome && game.gameOutcome.lastPeriodType !== "REG"
                        ? <span className={"teamAbbreviation wrap"}>{game.gameOutcome.lastPeriodType}</span>
                        : null
                    }
                    <span className={"teamAbbreviation wrap"}>
                        {game.homeTeam.score === undefined ? "-" : game.homeTeam.score.toLocaleString()}
                    </span>
                </div>
                : null
            }
        </button>
    </div>;
}

export default Game;
