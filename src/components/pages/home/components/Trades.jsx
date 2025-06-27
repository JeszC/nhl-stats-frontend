import {useCallback, useEffect, useState} from "react";
import constants from "../../../../data/constants.json";
import {getTeamLogo, splitArrayByKey} from "../../../../scripts/utils.js";
import TradeTeam from "./TradeTeam.jsx";

function Trades({teams}) {
    const [trades, setTrades] = useState([]);
    const [page, setPage] = useState(0);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [areAllTradesFetched, setAreAllTradesFetched] = useState(false);
    const numberOfItemsToFetch = 10;
    const fetchOffset = page * numberOfItemsToFetch;
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

    const getTrades = useCallback(async () => {
        let tradesResponse = await fetch(`${constants.baseURL}/trades/getTrades/${fetchOffset}`);
        if (tradesResponse.ok) {
            return await tradesResponse.json();
        }
        throw new Error("HTTP error when fetching trades.");
    }, [fetchOffset]);

    useEffect(() => {
        if (!areAllTradesFetched) {
            setFetchState(constants.fetchState.loading);
            getTrades()
                .then(fetchedTrades => {
                    setTrades(previousTrades => previousTrades.concat(fetchedTrades));
                    setFetchState(constants.fetchState.finished);
                    if (fetchedTrades.length < numberOfItemsToFetch) {
                        setAreAllTradesFetched(true);
                    }
                })
                .catch(ignored => setFetchState(constants.fetchState.error));
        }
    }, [areAllTradesFetched, getTrades]);

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
                               onClick={() => setPage(previousPage => previousPage + 1)}>
                         {isLoading ? "Loading..." : "Load more"}
                     </button>
                 }
             </div>;
}

export default Trades;
