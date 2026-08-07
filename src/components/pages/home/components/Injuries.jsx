import {useEffect, useState} from "react";
import constants from "../../../../data/constants.json";
import {getResponseData, splitArrayByKey} from "../../../../scripts/utils.js";
import LoadMoreButton from "../../../shared/common/loadMoreButton/LoadMoreButton.jsx";
import Injury from "./Injury.jsx";

function Injuries({teams}) {
    const [injuries, setInjuries] = useState([]);
    const [page, setPage] = useState(0);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const numberOfItemsToFetch = 10;
    const totalInjuriesOnPage = (page + 1) * numberOfItemsToFetch;
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });

    async function getInjuries() {
        let injuryResponse = await fetch(`${constants.baseURL}/injuries/getInjuries`);
        return await getResponseData(injuryResponse, "Error fetching injuries.");
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFetchState(constants.fetchState.loading);
        getInjuries()
            .then(fetchedInjuries => {
                setInjuries(fetchedInjuries);
                setFetchState(constants.fetchState.finished);
            })
            .catch(ignored => setFetchState(constants.fetchState.error));
    }, []);

    return <div id={"injuries"} className={"injuriesTradesSignings injuriesHome"}>
        <h2>Injuries</h2>
        {
            fetchState === constants.fetchState.error
            ? <span className={"injuriesTradesSigningsPlaceholder"}>Error fetching injuries.</span>
            : fetchState === constants.fetchState.loading
              ? <span className={"injuriesTradesSigningsPlaceholder"}>Loading injuries...</span>
              : injuries.length === 0
                ? <span className={"injuriesTradesSigningsPlaceholder"}>No injuries to display.</span>
                : <ul className={"injuriesTradesSigningsByDate"}>
                    {
                        splitArrayByKey(injuries.slice(0, totalInjuriesOnPage), "date").map((day, index) =>
                            <li key={index.toString()} className={"individualDay"}>
                               <span className={"injuryTradeSigningHeader"}>
                                   {formatterDate.format(new Date(day[0].date))}
                               </span>
                                <ul className={"injuries"}>
                                    {
                                        day.map(injury =>
                                            <li key={injury.competitorId.toString() + injury.player.id.toString()}
                                                className={"injury"}>
                                                <Injury injury={injury} teams={teams}></Injury>
                                            </li>
                                        )
                                    }
                                </ul>
                            </li>
                        )
                    }
                </ul>
        }
        <LoadMoreButton areAllFetched={fetchState !== constants.fetchState.error
                                       && totalInjuriesOnPage >= injuries.length}
                        fetchState={fetchState}
                        setPage={setPage}>
        </LoadMoreButton>
    </div>;
}

export default Injuries;
