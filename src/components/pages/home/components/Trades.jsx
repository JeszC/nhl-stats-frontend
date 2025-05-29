import constants from "../../../../data/constants.json";

function Trades({trades, fetchState, tradePage, setTradePage}) {
    const isLoading = fetchState === constants.fetchState.loading;

    return <>
        {
            trades.length === 0
            ? null
            : fetchState === constants.fetchState.error
              ? <span>Error fetching trades</span>
              : <div id={"trades"}>
                  <h2>Trades</h2>
                  <ul>
                      {
                          trades.map((trade, index) =>
                              <li key={trade.post_id + index.toString()}>{trade.post_excerpt}</li>
                          )
                      }
                  </ul>
                  <button type={"button"}
                          title={"Show more"}
                          disabled={isLoading}
                          onClick={() => setTradePage(tradePage + 1)}>
                      {isLoading ? "Loading..." : "Load more"}
                  </button>
              </div>
        }
    </>;
}

export default Trades;
