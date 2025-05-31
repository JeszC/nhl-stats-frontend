import constants from "../../../../data/constants.json";
import TradeTeam from "./TradeTeam.jsx";
import {getTeamLogo, splitArrayByKey} from "../../../../scripts/utils.js";

function Trades({trades, teams, fetchState, tradePage, setTradePage}) {
    const isLoading = fetchState === constants.fetchState.loading;
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });

    function fixAbbrev(team) {
        let teamAbbrev = team?.team?.team_shortname;
        switch (teamAbbrev) {
            case "LA":
                return "LAK";
            case "NJ":
                return "NJD";
            case "SJ":
                return "SJS";
            case "TB":
                return "TBL";
            default:
                return teamAbbrev;
        }
    }

    return trades.length === 0
           ? null
           : fetchState === constants.fetchState.error
             ? <span>Error fetching trades</span>
             : <div id={"trades"} className={"injuriesOrTrades"}>
                 <h2>Trades</h2>
                 <ul className={"injuriesOrTradesByDate"}>
                     {
                         splitArrayByKey(trades, "trade_date").map((day, index) =>
                             <li key={index} className={"individualDay"}>
                                 <span className={"injuryOrTradeHeader"}>
                                     {formatterDate.format(new Date(day[0].post_date))}
                                 </span>
                                 <ul className={"trades"}>
                                     {
                                         day.map((trade, index) =>
                                             <li key={trade.post_id + index.toString()}
                                                 className={"verticalFlex trade"}>
                                                 <TradeTeam team={trade.details[0]}
                                                            teamLogo={getTeamLogo(teams, fixAbbrev(trade.details[0]))}
                                                            teamAbbrev={fixAbbrev(trade.details[0])}>
                                                 </TradeTeam>
                                                 <TradeTeam team={trade.details[1]}
                                                            teamLogo={getTeamLogo(teams, fixAbbrev(trade.details[1]))}
                                                            teamAbbrev={fixAbbrev(trade.details[1])}>
                                                 </TradeTeam>
                                             </li>
                                         )
                                     }
                                 </ul>
                             </li>
                         )
                     }
                 </ul>
                 <button type={"button"}
                         className={"tradesShowMoreButton"}
                         title={isLoading ? "Loading..." : "Load more"}
                         disabled={isLoading}
                         onClick={() => setTradePage(tradePage + 1)}>
                     {isLoading ? "Loading..." : "Load more"}
                 </button>
             </div>;
}

export default Trades;
