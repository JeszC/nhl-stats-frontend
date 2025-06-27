import {useCallback, useEffect, useState} from "react";
import constants from "../../../../data/constants.json";
import {getTeamLogo, getTeamName, splitArrayByKey} from "../../../../scripts/utils.js";

function Signings({teams}) {
    const [signings, setSignings] = useState([]);
    const [areAllSigningsFetched, setAreAllSigningsFetched] = useState(false);
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const [signingsPage, setSigningsPage] = useState(0);
    const numberOfItemsToFetch = 10;
    const signingOffset = signingsPage * numberOfItemsToFetch;
    const isLoading = fetchState === constants.fetchState.loading;
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });

    function fixAbbrev(team) {
        let teamAbbrev = team?.team_shortname.toUpperCase();
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

    const getSignings = useCallback(async () => {
        let signingsResponse = await fetch(`${constants.baseURL}/signings/getSignings/${signingOffset}`);
        if (signingsResponse.ok) {
            return await signingsResponse.json();
        }
        throw new Error("HTTP error when fetching signings.");
    }, [signingOffset]);

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
                                                                 <span>{signing.player_position}</span>
                                                                 <span>{signing.age.toLocaleString()} y/o</span>
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
                 {
                     areAllSigningsFetched
                     ? null
                     : <button type={"button"}
                               className={"loadMoreButton"}
                               title={isLoading ? "Loading..." : "Load more"}
                               disabled={isLoading}
                               onClick={() => setSigningsPage(previousPage => previousPage + 1)}>
                         {isLoading ? "Loading..." : "Load more"}
                     </button>
                 }
             </div>;
}

export default Signings;
