import {Fragment} from "react";
import {
    capitalize,
    getOrdinalNumber,
    getPeriodTitle,
    getPlayerFirstName,
    getPlayerFullName,
    getPlayerLastName,
    parsePeriodTime
} from "../../../../../../../../scripts/parsing.js";
import {getPlayer, getVideoURL, getVisualizerURL} from "../../../../../../../../scripts/utils.js";
import checkmarkIcon from "../../../../images/Checkmark.svg";
import crossIcon from "../../../../images/Cross.svg";
import playIcon from "../../../../images/Play.svg";

function Scoring({game, setPlayer, setActiveView, setPreviousView, setFetchState}) {

    return <details className={"gamesContent"} open>
        <summary className={"gamesTitle"}>Scoring</summary>
        <div className={"periodInformation"}>
            {
                game.summary.scoring.map((period, index) =>
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
                                {
                                    game.summary.shotsByPeriod[index] && getPeriodTitle(game.gameType,
                                        period.periodDescriptor.number,
                                        period.periodDescriptor.otPeriods) !== "Shootout"
                                    ? <div className={"horizontalFlex periodSeparatorInformation"}>
                                        <span>Shots: </span>
                                        <span>
                                            {`${game.awayTeam.abbrev}
                                            ${game.summary.shotsByPeriod[index].away.toLocaleString()}`}
                                        </span>
                                        <span>-</span>
                                        <span>
                                            {`${game.homeTeam.abbrev}
                                            ${game.summary.shotsByPeriod[index].home.toLocaleString()}`}
                                        </span>
                                    </div>
                                    : <div className={"horizontalFlex periodSeparatorInformation"}>
                                        <span>Shots: </span>
                                        <span>{`${game.awayTeam.abbrev} 0`}</span>
                                        <span>-</span>
                                        <span>{`${game.homeTeam.abbrev} 0`}</span>
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            period.goals.length !== 0 && getPeriodTitle(game.gameType,
                                period.periodDescriptor.number,
                                period.periodDescriptor.otPeriods) !== "Shootout"
                            ? period.goals.map((goal, goalIndex) =>
                                <div key={goal.playerId + index.toString() + goalIndex.toString()}
                                     className={"horizontalFlex playerInformation"}>
                                    <div className={"verticalFlex scorerImageAndLinks"}>
                                        <button type={"button"}
                                                className={"textOnlyButton"}
                                                title={"Show player details"}
                                                onClick={() =>
                                                    getPlayer(goal.playerId,
                                                        setPlayer,
                                                        setFetchState,
                                                        setActiveView,
                                                        setPreviousView)}>
                                            <img className={`defaultImage gamesImage zoom
                                             default ${goal.teamAbbrev.default} gradient`}
                                                 src={goal.headshot}
                                                 alt={`${getPlayerFullName(goal)} headshot`}/>
                                        </button>
                                        <div className={"verticalFlex goalLinks"}>
                                            {
                                                goal.highlightClip
                                                ? <div className={"horizontalFlex individualGoal"}>
                                                    <img className={"playButton zoom"}
                                                         src={playIcon}
                                                         alt={"Play button icon"}/>
                                                    <a target={"_blank"}
                                                       rel={"noopener noreferrer"}
                                                       href={getVideoURL(goal.highlightClip)}
                                                       title={"Highlight"}>
                                                        Highlight
                                                    </a>
                                                </div>
                                                : null
                                            }
                                            {
                                                goal.eventId
                                                ? <div className={"horizontalFlex individualGoal"}>
                                                    <img className={"playButton zoom"}
                                                         src={playIcon}
                                                         alt={"Play button icon"}/>
                                                    <a target={"_blank"}
                                                       rel={"noopener noreferrer"}
                                                       href={getVisualizerURL(game.id, goal.eventId)}
                                                       title={"Visualizer"}>
                                                        Visualizer
                                                    </a>
                                                </div>
                                                : null
                                            }
                                        </div>
                                    </div>
                                    <div className={"verticalFlex"}>
                                        <button type={"button"}
                                                className={"textOnlyButton primary"}
                                                title={"Show player details"}
                                                onClick={() =>
                                                    getPlayer(goal.playerId,
                                                        setPlayer,
                                                        setFetchState,
                                                        setActiveView,
                                                        setPreviousView)}>
                                            {`${getPlayerFullName(goal)} (${goal.goalsToDate.toLocaleString()})`}
                                        </button>
                                        {
                                            goal.assists.map((assist, index) =>
                                                <button key={assist.playerId + index.toString()}
                                                        type={"button"}
                                                        className={"textOnlyButton secondary"}
                                                        title={"Show player details"}
                                                        onClick={() =>
                                                            getPlayer(assist.playerId,
                                                                setPlayer,
                                                                setFetchState,
                                                                setActiveView,
                                                                setPreviousView)}>
                                                    {
                                                        `${getPlayerFullName(assist)}
                                                        (${assist.assistsToDate.toLocaleString()})`
                                                    }
                                                </button>
                                            )
                                        }
                                        <div className={"verticalFlex"}>
                                            <div className={"horizontalFlex stats"}>
                                                {
                                                    goal.shotType
                                                    ? <span className={"statType"}>{capitalize(goal.shotType)}</span>
                                                    : null
                                                }
                                                {
                                                    goal.goalModifier === "none"
                                                    ? null
                                                    : <span className={"statType"}>
                                                        {capitalize(goal.goalModifier)}
                                                    </span>
                                                }
                                            </div>
                                            <div className={"horizontalFlex stats"}>
                                                <span>{goal.teamAbbrev.default}</span>
                                                <span>
                                                    {
                                                        parsePeriodTime(game.gameType,
                                                            period.periodDescriptor.number,
                                                            goal.timeInPeriod)
                                                    }
                                                </span>
                                            </div>
                                            <div className={"horizontalFlex stats"}>
                                                <span>{goal.strength.toUpperCase()}</span>
                                                <span>
                                                    {goal.awayScore
                                                         .toLocaleString()} - {goal.homeScore.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            : null
                        }
                    </Fragment>
                )
            }
        </div>
        {
            game?.summary?.shootout
            ? <div className={"shootoutShooters"}>
                {
                    game?.summary?.shootout?.map(shooter =>
                        <div key={shooter.playerId} className={"verticalFlex shootoutShooter"}>
                            <div className={"horizontalFlex shootoutImageAndResult"}>
                                <button type={"button"}
                                        className={"textOnlyButton"}
                                        title={"Show player details"}
                                        onClick={() =>
                                            getPlayer(shooter.playerId,
                                                setPlayer,
                                                setFetchState,
                                                setActiveView,
                                                setPreviousView)}>
                                    <img className={`defaultImage shootoutImage zoom default
                                    ${shooter.teamAbbrev.default} gradient`}
                                         src={shooter.headshot}
                                         alt={`${getPlayerFullName(shooter)} headshot`}/>
                                </button>
                                {
                                    shooter.result === "goal"
                                    ? <img className={"goalIndicatorIcon goalIcon"}
                                           src={checkmarkIcon}
                                           alt={"Checkmark icon"}/>
                                    : <img className={"goalIndicatorIcon saveIcon"}
                                           src={crossIcon}
                                           alt={"Cross icon"}/>
                                }
                            </div>
                            <div className={"verticalFlex shootoutShooterInformation"}>
                                <button type={"button"}
                                        className={"textOnlyButton primary"}
                                        title={"Show player details"}
                                        onClick={() =>
                                            getPlayer(shooter.playerId,
                                                setPlayer,
                                                setFetchState,
                                                setActiveView,
                                                setPreviousView)}>
                                    <div className={"verticalFlex shootoutShooterName"}>
                                        <span>{getPlayerFirstName(shooter)}</span>
                                        <span>{getPlayerLastName(shooter)}</span>
                                    </div>
                                </button>
                                <div className={"horizontalFlex shootoutShotInformation"}>
                                    <div className={"verticalFlex stats"}>
                                        <span className={"statType"}>{shooter.teamAbbrev.default}</span>
                                        <span className={"statType"}>{getOrdinalNumber(shooter.sequence)}</span>
                                    </div>
                                    <div className={"verticalFlex stats"}>
                                        <span className={"statType"}>{capitalize(shooter.result)}</span>
                                        <span className={"statType"}>{capitalize(shooter.shotType)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            : null
        }
    </details>;
}

export default Scoring;
