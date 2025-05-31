import constants from "../../../../data/constants.json";
import TradeTeam from "./TradeTeam.jsx";

function Trades({trades, teams, fetchState, tradePage, setTradePage}) {
    const isLoading = fetchState === constants.fetchState.loading;
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });

    function splitArrayByKey(array, key) {
        let slicedArray = [];
        let index = 0;
        for (let i = 1; i < array.length; i++) {
            if (array[i][key] !== array[i - 1][key]) {
                slicedArray.push(array.slice(index, i));
                index = i;
            }
        }
        slicedArray.push(array.slice(index, array.length));
        return slicedArray;
    }

    function getTeamLogo(teamAbbrev) {
        if (teams && teams.length > 0) {
            for (let team of teams) {
                if (team?.teamAbbrev?.default === teamAbbrev) {
                    return team?.teamLogo;
                }
            }
        }
        return null;
    }

    function fixAbbreviation(team) {
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

    return <>
        {
            trades.length === 0
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
                                                             teamLogo={getTeamLogo(fixAbbreviation(trade.details[0]))}
                                                             teamAbbrev={fixAbbreviation(trade.details[0])}>
                                                  </TradeTeam>
                                                  <TradeTeam team={trade.details[1]}
                                                             teamLogo={getTeamLogo(fixAbbreviation(trade.details[1]))}
                                                             teamAbbrev={fixAbbreviation(trade.details[1])}>
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
              </div>
        }
    </>;
}

export default Trades;
