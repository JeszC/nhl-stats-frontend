import {
    getPlayerFirstName,
    getPlayerFullName,
    getPlayerLastName,
    parseDecimals,
    parseRecord
} from "../../../../../../../../../scripts/parsing.js";
import {compareNumeric, getPlayer, getValue} from "../../../../../../../../../scripts/utils.js";
import constants from "../../../../../../../../../data/constants.json";

function teamGoalies({game, isAway, setPlayer, setActiveView, setPreviousView, setFetchState}) {
    const team = isAway ? "awayTeam" : "homeTeam";
    const leaders = game.matchup.goalieComparison[team].leaders;
    const placeholderValue = "N/A";

    function setValues(goalie) {
        if (goalie.gamesPlayed === undefined) {
            goalie.gamesPlayed = 0;
        }
        if (!goalie.record) {
            if (game.gameType === constants.gameType.playoff.index) {
                goalie.record = "0-0";
            } else {
                goalie.record = "0-0-0";
            }
        }
        if (goalie.gaa === undefined) {
            goalie.gaa = 0;
        }
        if (goalie.savePctg === undefined) {
            goalie.savePctg = 0;
        }
        if (goalie.shutouts === undefined) {
            goalie.shutouts = 0;
        }
        return goalie;
    }

    function compareGoalies(a, b) {
        let gamesA = a.gamesPlayed;
        let gamesB = b.gamesPlayed;
        let result = compareNumeric(gamesA, gamesB);
        if (result === 0) {
            return b.savePctg - a.savePctg;
        }
        return gamesB - gamesA;
    }

    return <div className={"verticalFlex statisticsColumn"}>
        <span className={`statisticsHeader ${game[team].abbrev} border`}>{game[team].abbrev}</span>
        {
            leaders.length === 0
            ? <div className={"horizontalFlex singlePlayer emptyGoalieData"}>{placeholderValue}</div>
            : leaders.map(goalie => setValues(goalie))
                     .sort(compareGoalies)
                     .map(goalie =>
                         <button type={"button"}
                                 className={"horizontalFlex singlePlayer upcomingGameButton"}
                                 key={goalie.playerId}
                                 onClick={() =>
                                     getPlayer(goalie.playerId,
                                         setPlayer,
                                         setFetchState,
                                         setActiveView,
                                         setPreviousView)}>
                             <div className={"horizontalFlex singlePlayerImageAndInformation"}>
                                 <img className={`defaultImage headerImage zoom default ${game[team].abbrev} gradient`}
                                      src={goalie.headshot}
                                      alt={`${getPlayerFullName(goalie)} headshot`}/>
                                 <div className={"verticalFlex singlePlayerInformation"}>
                                     <span className={"singlePlayerText"}>{getPlayerFirstName(goalie)}</span>
                                     <span className={"singlePlayerText"}>{getPlayerLastName(goalie)}</span>
                                     <div className={"horizontalFlex singlePlayerNumberAndPosition"}>
                                         {
                                             goalie.sweaterNumber
                                             ? <span className={"singlePlayerText"}>
                                                 #{goalie.sweaterNumber.toLocaleString()}
                                             </span>
                                             : <span className={"singlePlayerText"}>N/A</span>
                                         }
                                         <span className={"singlePlayerText"}>{goalie.positionCode}</span>
                                     </div>
                                 </div>
                             </div>
                             <div className={"verticalFlex SingleGoalieStatistics"}>
                                 <div className={"horizontalFlex singleGoalieStatistic"}>
                                     <span className={"singlePlayerText"}>Record</span>
                                     <span className={"singlePlayerText"}>
                                       {parseRecord(getValue(["record"], goalie, false, "0-0-0"))}
                                     </span>
                                 </div>
                                 <div className={"horizontalFlex singleGoalieStatistic"}>
                                     <span className={"singlePlayerText"}>GAA</span>
                                     <span className={"singlePlayerText"}>
                                       {parseDecimals(getValue(["gaa"], goalie, false, 0), 1)}
                                     </span>
                                 </div>
                                 <div className={"horizontalFlex singleGoalieStatistic"}>
                                     <span className={"singlePlayerText"}>SV%</span>
                                     <span className={"singlePlayerText"}>
                                       {parseDecimals(getValue(["savePctg"], goalie, false, 0), 100)}
                                     </span>
                                 </div>
                                 <div className={"horizontalFlex singleGoalieStatistic"}>
                                     <span className={"singlePlayerText"}>SO</span>
                                     <span className={"singlePlayerText"}>
                                       {getValue(["shutouts"], goalie, false, 0).toLocaleString()}
                                     </span>
                                 </div>
                             </div>
                         </button>
                     )
        }
    </div>;
}

export default teamGoalies;
