import {
    capitalize,
    getPlayerFirstName,
    getPlayerFullName,
    getPlayerLastName
} from "../../../../../../../../scripts/parsing.js";
import {getPlayer} from "../../../../../../../../scripts/utils.js";

function LastFiveLeader({game, isAway, setPlayer, setActiveView, setPreviousView, setFetchState}) {
    const team = isAway ? "awayTeam" : "homeTeam";
    const teamLeader = isAway ? "awayLeader" : "homeLeader";
    const placeholderValue = "N/A";

    return <div className={"verticalFlex statisticsColumn"}>
        <span className={`statisticsHeader ${game[team].abbrev} border`}>{game[team].abbrev}</span>
        {
            game.matchup.skaterComparison.leaders.map((category, index) =>
                category[teamLeader] === undefined
                ? <div className={"horizontalFlex singlePlayer"} key={category.category + index.toString()}>
                    {placeholderValue}
                </div>
                : <button type={"button"}
                          className={"horizontalFlex singlePlayer upcomingGameButton"}
                          key={category.category + index.toString()}
                          onClick={() =>
                              getPlayer(category[teamLeader].playerId,
                                  setPlayer,
                                  setFetchState,
                                  setActiveView,
                                  setPreviousView)}>
                    <div className={"horizontalFlex singlePlayerImageAndInformation"}>
                        <img className={`defaultImage headerImage zoom default ${game[team].abbrev} gradient`}
                             src={category[teamLeader].headshot}
                             alt={`${getPlayerFullName(category[teamLeader])} headshot`}/>
                        <div className={"verticalFlex singlePlayerInformation"}>
                            <span className={"singlePlayerText"}>{getPlayerFirstName(category[teamLeader])}</span>
                            <span className={"singlePlayerText"}>{getPlayerLastName(category[teamLeader])}</span>
                            <div className={"horizontalFlex singlePlayerNumberAndPosition"}>
                                {
                                    category[teamLeader].sweaterNumber
                                    ? <span className={"singlePlayerText"}>
                                        #{category[teamLeader].sweaterNumber?.toLocaleString()}
                                    </span>
                                    : <span className={"singlePlayerText"}>N/A</span>
                                }
                                <span className={"singlePlayerText"}>{category[teamLeader].positionCode}</span>
                            </div>
                        </div>
                    </div>
                    <div className={"horizontalFlex singlePlayerCategoryAndValue"}>
                        <span className={"singlePlayerText singlePlayerStatistic"}>
                            {capitalize(category.category)}
                        </span>
                        <span className={"singlePlayerText singlePlayerStatistic"}>
                            {category[teamLeader].value.toLocaleString()}
                        </span>
                    </div>
                </button>
            )
        }
    </div>;
}

export default LastFiveLeader;
