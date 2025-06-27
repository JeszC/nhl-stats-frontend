import constants from "../../../../data/constants.json";
import {getTeamLogo, splitArrayByKey} from "../../../../scripts/utils.js";
import TradeTeam from "./TradeTeam.jsx";

function Trades({trades, teams, areAllTradesFetched, fetchState, setTradePage}) {
    const isLoading = fetchState === constants.fetchState.loading;
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });

    function fixAbbrev(team) {
        let teamAbbrev = team?.team?.team_shortname.toUpperCase();
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
             : <div id={"trades"} className={"injuriesTradesSignings"}>
                 <h2>Trades</h2>
                 <ul className={"injuriesTradesSigningsByDate"}>
                     {
                         splitArrayByKey(trades, "trade_date").map((day, index) =>
                             <li key={index} className={"individualDay"}>
                                 <span className={"injuryTradeSigningHeader"}>
                                     {formatterDate.format(new Date(day[0].post_date))}
                                 </span>
                                 <ul className={"trades"}>
                                     {
                                         day.map(trade =>
                                             <li key={trade.post_id} className={"verticalFlex trade"}>
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
                 {
                     areAllTradesFetched
                     ? null
                     : <button type={"button"}
                               className={"loadMoreButton"}
                               title={isLoading ? "Loading..." : "Load more"}
                               disabled={isLoading}
                               onClick={() => setTradePage(previousPage => previousPage + 1)}>
                         {isLoading ? "Loading..." : "Load more"}
                     </button>
                 }
             </div>;
}

export default Trades;
