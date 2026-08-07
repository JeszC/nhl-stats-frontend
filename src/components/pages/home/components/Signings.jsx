import {useCallback, useEffect, useState} from "react";
import constants from "../../../../data/constants.json";
import {getResponseData, splitArrayByKey} from "../../../../scripts/utils.js";
import LoadMoreButton from "../../../shared/common/loadMoreButton/LoadMoreButton.jsx";
import Signing from "./Signing.jsx";

function Signings({teams}) {
    const [signings, setSignings] = useState([]);
    const [page, setPage] = useState(0);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [areAllSigningsFetched, setAreAllSigningsFetched] = useState(false);
    const numberOfItemsToFetch = 10;
    const fetchOffset = page * numberOfItemsToFetch;
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });

    const getSignings = useCallback(async () => {
        let signingsResponse = await fetch(`${constants.baseURL}/signings/getSignings/${fetchOffset}`);
        return await getResponseData(signingsResponse, "Error fetching signings.");
    }, [fetchOffset]);

    useEffect(() => {
        if (!areAllSigningsFetched) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFetchState(constants.fetchState.loading);
            getSignings()
                .then(fetchedSignings => {
                    setSignings(previousSignings => previousSignings.concat(fetchedSignings));
                    setFetchState(constants.fetchState.finished);
                    if (fetchedSignings.length < numberOfItemsToFetch) {
                        setAreAllSigningsFetched(true);
                    }
                })
                .catch(ignored => setFetchState(constants.fetchState.error));
        }
    }, [areAllSigningsFetched, getSignings]);

    return <div id={"signings"} className={"injuriesTradesSignings"}>
        <h2>Signings</h2>
        {
            fetchState === constants.fetchState.error
            ? <span className={"injuriesTradesSigningsPlaceholder"}>Error fetching signings.</span>
            : fetchState === constants.fetchState.loading
              ? <span className={"injuriesTradesSigningsPlaceholder"}>Loading signings...</span>
              : signings.length === 0
                ? <span className={"injuriesTradesSigningsPlaceholder"}>No signings to display.</span>
                : <ul className={"injuriesTradesSigningsByDate"}>
                    {
                        splitArrayByKey(signings, "signing_date").map((day, index) =>
                            <li key={index.toString()} className={"individualDay"}>
                                 <span className={"injuryTradeSigningHeader"}>
                                     {formatterDate.format(new Date(day[0].signing_date))}
                                 </span>
                                <ul className={"signings"}>
                                    {
                                        day.map(signing =>
                                            <li key={signing.post_id} className={"signing"}>
                                                <Signing signing={signing} teams={teams}/>
                                            </li>
                                        )
                                    }
                                </ul>
                            </li>
                        )
                    }
                </ul>
        }
        <LoadMoreButton areAllFetched={areAllSigningsFetched}
                        fetchState={fetchState}
                        setPage={setPage}>
        </LoadMoreButton>
    </div>;
}

export default Signings;
