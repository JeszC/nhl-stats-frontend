import {useCallback, useEffect, useState} from "react";
import constants from "../../../../data/constants.json";
import {fixAbbreviation} from "../../../../scripts/parsing.js";
import {getResponseData, getTeamLogo, splitArrayByKey} from "../../../../scripts/utils.js";
import LoadMoreButton from "../../../shared/common/loadMoreButton/LoadMoreButton.jsx";
import TradeTeam from "./TradeTeam.jsx";

function Trades({teams}) {
    const [trades, setTrades] = useState([]);
    const [page, setPage] = useState(0);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [areAllTradesFetched, setAreAllTradesFetched] = useState(false);
    const numberOfItemsToFetch = 10;
    const fetchOffset = page * numberOfItemsToFetch;
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });

    function fixAbbrev(team) {
        return fixAbbreviation(team?.team?.team_shortname);
    }

    const getTrades = useCallback(async () => {
        let tradesResponse = await fetch(`${constants.baseURL}/trades/getTrades/${fetchOffset}`);
        return await getResponseData(tradesResponse, "Error fetching trades.");
    }, [fetchOffset]);

    useEffect(() => {
        if (!areAllTradesFetched) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
    }, [areAllTradesFetched, getTrades, numberOfItemsToFetch]);

    return <div id={"trades"} className={"injuriesTradesSignings"}>
        <h2>Trades</h2>
        {
            fetchState === constants.fetchState.error
            ? <span className={"injuriesTradesSigningsPlaceholder"}>Error fetching trades.</span>
            : fetchState === constants.fetchState.loading
              ? <span className={"injuriesTradesSigningsPlaceholder"}>Loading trades...</span>
              : trades.length === 0
                ? <span className={"injuriesTradesSigningsPlaceholder"}>No trades to display.</span>
                : <ul className={"injuriesTradesSigningsByDate"}>
                    {
                        splitArrayByKey(trades, "trade_date").map((day, index) =>
                            <li key={index.toString()} className={"individualDay"}>
                                 <span className={"injuryTradeSigningHeader"}>
                                     {formatterDate.format(new Date(day[0].trade_date))}
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
        }
        <LoadMoreButton areAllFetched={areAllTradesFetched}
                        fetchState={fetchState}
                        setPage={setPage}>
        </LoadMoreButton>
    </div>;
}

export default Trades;
