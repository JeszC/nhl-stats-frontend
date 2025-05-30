import constants from "../../../../data/constants.json";
import TradeTeam from "./TradeTeam.jsx";

function Trades({trades, fetchState, tradePage, setTradePage}) {
    const isLoading = fetchState === constants.fetchState.loading;

    return <>
        {
            trades.length === 0
            ? null
            : fetchState === constants.fetchState.error
              ? <span>Error fetching trades</span>
              : <div id={"trades"} className={"injuriesOrTrades"}>
                  <h2>Trades</h2>
                  <ul className={"trades"}>
                      {
                          trades.map((trade, index) =>
                              <li key={trade.post_id + index.toString()} className={"verticalFlex trade"}>
                                  <TradeTeam team={trade.details[0]}></TradeTeam>
                                  <TradeTeam team={trade.details[1]}></TradeTeam>
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
              </div>
        }
    </>;
}

export default Trades;
