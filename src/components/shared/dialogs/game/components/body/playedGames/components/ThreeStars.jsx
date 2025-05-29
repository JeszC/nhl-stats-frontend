import {getOrdinalNumber, getPlayerName, parseDecimals} from "../../../../../../../../scripts/parsing.js";
import {getPlayer, isGameLive} from "../../../../../../../../scripts/utils.js";

function ThreeStars({game, setPlayer, setActiveView, setPreviousView, setFetchState}) {

    return <>
        {
            isGameLive(game.gameState) || game.summary.threeStars.length === 0
            ? null
            : <div className={"gamesContent"}>
                <h3>Three stars</h3>
                <div className={"threeStars"}>
                    {
                        game.summary.threeStars.map((star, index) =>
                            <button key={star.name.default + index}
                                    type={"button"}
                                    title={"Show player details"}
                                    className={`singleStar horizontalFlex default
                                    ${star.teamAbbrev} gradient awayTeam`}
                                    onClick={() =>
                                        getPlayer(star.playerId,
                                            setPlayer,
                                            setFetchState,
                                            setActiveView,
                                            setPreviousView)}>
                                <img className={"starImage zoom"}
                                     src={star.headshot}
                                     alt={`${getPlayerName(star)} headshot`}/>
                                <div className={"verticalFlex singleStarInformation"}>
                                    <span className={"starNumber"}>{getOrdinalNumber(star.star)} star</span>
                                    <span className={"starName"}>{getPlayerName(star)}</span>
                                    <div className={"horizontalFlex singleStarStatistics"}>
                                        <span>{star.teamAbbrev}</span>
                                        <span>{star.position}</span>
                                        <span>#{star.sweaterNo.toLocaleString()}</span>
                                    </div>
                                    <div className={"horizontalFlex singleStarStatistics"}>
                                        {
                                            star.position === "G"
                                            ? <>
                                                <span>
                                                    GAA: {star.goalsAgainstAverage === undefined
                                                          ? "N/A"
                                                          : parseDecimals(star.goalsAgainstAverage, 1)}
                                                </span>
                                                <span>
                                                    SV%: {star.savePctg === undefined
                                                          ? "N/A"
                                                          : parseDecimals(star.savePctg)}
                                                </span>
                                            </>
                                            : <>
                                                <span>
                                                    G: {star.goals === undefined
                                                        ? "N/A"
                                                        : star.goals.toLocaleString()}
                                                </span>
                                                <span>
                                                    A: {star.assists === undefined
                                                        ? "N/A"
                                                        : star.assists.toLocaleString()}
                                                </span>
                                            </>
                                        }
                                    </div>
                                </div>
                            </button>
                        )
                    }
                </div>
            </div>
        }
    </>;
}

export default ThreeStars;
