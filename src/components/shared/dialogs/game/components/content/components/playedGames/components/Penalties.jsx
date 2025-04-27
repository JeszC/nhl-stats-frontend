import {Fragment} from "react";
import {getPeriodTitle, parsePeriodTime} from "../../../../../../../../../scripts/parsing.js";
import {getPlayer} from "../../../../../../../../../scripts/utils.js";

function Penalties({game, setPlayer, setActiveView, setPreviousView, setFetchState}) {

    return <details className={"gamesContent"} open>
        <summary className={"gamesTitle"}>Penalties</summary>
        <div className={"periodInformation"}>
            {
                game.summary.penalties.map(period =>
                    <Fragment key={getPeriodTitle(game.gameType,
                        period.periodDescriptor.number,
                        period.periodDescriptor.otPeriods)}>
                        <div className={"periodSeparator"}>
                            <div className={"horizontalFlex"}>
                                <h4>
                                    {
                                        getPeriodTitle(game.gameType,
                                            period.periodDescriptor.number,
                                            period.periodDescriptor.otPeriods)
                                    }
                                </h4>
                                <div className={"horizontalFlex periodSeparatorInformation"}>
                                    <span>Penalty minutes: </span>
                                    <span>
                                        {
                                            `${game.awayTeam.abbrev} ${period.penalties.reduce((accumulator, penalty) =>
                                                penalty.teamAbbrev.default === game.awayTeam.abbrev
                                                ? accumulator + penalty.duration
                                                : accumulator, 0).toLocaleString()}`
                                        }
                                    </span>
                                    <span>-</span>
                                    <span>
                                        {
                                            `${game.homeTeam.abbrev} ${period.penalties.reduce((accumulator, penalty) =>
                                                penalty.teamAbbrev.default === game.homeTeam.abbrev
                                                ? accumulator + penalty.duration
                                                : accumulator, 0).toLocaleString()}`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        {
                            period.penalties.map((penalty, index) =>
                                <div key={penalty.teamAbbrev.default + index.toString()}
                                     className={"horizontalFlex playerInformation"}>
                                    <button type={"button"}
                                            className={"textOnlyButton"}
                                            title={"Show player details"}
                                            onClick={() =>
                                                getPlayer(penalty.playerId,
                                                    setPlayer,
                                                    setFetchState,
                                                    setActiveView,
                                                    setPreviousView)}>
                                        <img className={`defaultImage gamesImage zoom
                                        default ${penalty.teamAbbrev.default} gradient`}
                                             src={penalty.headshot}
                                             alt={penalty.committedByPlayer
                                                  ? `${penalty.committedByPlayer} headshot`
                                                  : `${penalty.servedBy} headshot`}/>
                                    </button>
                                    <div className={"verticalFlex"}>
                                        <button type={"button"}
                                                className={"textOnlyButton primary"}
                                                title={"Show player details"}
                                                onClick={() =>
                                                    getPlayer(penalty.playerId,
                                                        setPlayer,
                                                        setFetchState,
                                                        setActiveView,
                                                        setPreviousView)}>
                                            {
                                                penalty.committedByPlayer
                                                ? penalty.committedByPlayer.default
                                                : penalty.servedBy
                                                  ? penalty.servedBy.default
                                                  : penalty.teamAbbrev.default
                                            }
                                        </button>
                                        {
                                            penalty.drawnBy
                                            ? <span className={"secondary"}>{penalty.drawnBy.default}</span>
                                            : null
                                        }
                                        <div className={"horizontalFlex stats"}>
                                            <span className={"statType"}>
                                                {
                                                    penalty.descKey.charAt(0).toUpperCase() + penalty.descKey.slice(1)
                                                }
                                            </span>
                                        </div>
                                        <div className={"verticalFlex"}>
                                            <div className={"horizontalFlex stats"}>
                                                <span>{penalty.teamAbbrev.default}</span>
                                                <span>
                                                    {
                                                        parsePeriodTime(game.gameType,
                                                            period.periodDescriptor.number,
                                                            penalty.timeInPeriod)
                                                    }
                                                </span>
                                            </div>
                                            <div className={"horizontalFlex stats"}>
                                                <span>{penalty.duration.toLocaleString()} min</span>
                                                <span>{penalty.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </Fragment>
                )
            }
        </div>
    </details>;
}

export default Penalties;
