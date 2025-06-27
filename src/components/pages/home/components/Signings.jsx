import constants from "../../../../data/constants.json";
import {getTeamLogo, getTeamName, splitArrayByKey} from "../../../../scripts/utils.js";

function Signings({signings, teams, areAllSigningsFetched, fetchState, setSigningsPage}) {
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

    return signings.length === 0
           ? null
           : fetchState === constants.fetchState.error
             ? <span>Error fetching signings</span>
             : <div id={"signings"} className={"injuriesOrTrades"}>
                 <h2>Signings</h2>
                 <ul className={"injuriesOrTradesByDate"}>
                     {
                         splitArrayByKey(signings, "signing_date").map((day, index) =>
                             <li key={index} className={"individualDay"}>
                                 <span className={"injuryOrTradeHeader"}>
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
