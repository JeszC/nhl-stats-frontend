import {useCallback, useEffect, useState} from "react";
import constants from "../../../../data/constants.json";
import {getResponseData, getTeamLogo, getTeamName, splitArrayByKey} from "../../../../scripts/utils.js";
import LoadMoreButton from "../../../shared/common/loadMoreButton/LoadMoreButton.jsx";
import {fixAbbreviation} from "../../../../scripts/parsing.js";

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

    function fixAbbrev(team) {
        return fixAbbreviation(team?.team_shortname);
    }

    function fixPositionTitle(positionTitle) {
        switch (positionTitle) {
            case "Left Wing":
                return "Left Winger";
            case "Right Wing":
                return "Right Winger";
            case "Defense":
                return "Defender";
            default:
                return positionTitle;
        }
    }

    const getSignings = useCallback(async () => {
        let signingsResponse = await fetch(`${constants.baseURL}/signings/getSignings/${fetchOffset}`);
        return await getResponseData(signingsResponse, "Error fetching signings.");
    }, [fetchOffset]);

    useEffect(() => {
        if (!areAllSigningsFetched) {
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

    return signings.length === 0
           ? null
           : fetchState === constants.fetchState.error
             ? <span>Error fetching signings</span>
             : <div id={"signings"} className={"injuriesTradesSignings"}>
                 <h2>Signings</h2>
                 <ul className={"injuriesTradesSigningsByDate"}>
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
                                                 <div className={"horizontalFlex signingImageAndInformation"}>
                                                     <img className={`signingLogo default
                                                     ${fixAbbrev(signing)} gradient`}
                                                          src={getTeamLogo(teams, fixAbbrev(signing))}
                                                          alt={`${signing.team_shortname} logo`}/>
                                                     <div className={"verticalFlex signingInformation"}>
                                                         <div className={"verticalFlex signingDetails"}>
                                                             <span className={"signingInformationTitle"}>
                                                                 {signing.name}
                                                             </span>
                                                             <div className={"horizontalFlex signingPlayerDetails"}>
                                                                 <span>
                                                                     {
                                                                         signing.player_position
                                                                         ? fixPositionTitle(signing.player_position)
                                                                         : "N/A"
                                                                     }
                                                                 </span>
                                                                 <span>
                                                                     {
                                                                         signing.age
                                                                         ? signing.age.toLocaleString()
                                                                         : "N/A"
                                                                     } y/o</span>
                                                             </div>
                                                             <span>{getTeamName(teams, fixAbbrev(signing))}</span>
                                                         </div>
                                                         <div className={"verticalFlex signingDetails"}>
                                                             <span>
                                                                 {signing.contract_details[1].value}
                                                                 , {signing.contract_details[0].value}
                                                             </span>
                                                             <span>{signing.contract_details[2].value} AAV</span>
                                                             <span>{signing.contract_details[3].value} Total</span>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </li>
                                         )
                                     }
                                 </ul>
                             </li>
                         )
                     }
                 </ul>
                 <LoadMoreButton areAllFetched={areAllSigningsFetched}
                                 fetchState={fetchState}
                                 setPage={setPage}>
                 </LoadMoreButton>
             </div>;
}

export default Signings;
