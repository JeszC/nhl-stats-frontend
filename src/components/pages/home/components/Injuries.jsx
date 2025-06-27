import {capitalize, getPositionTitle} from "../../../../scripts/parsing.js";
import {getTeamLogo, splitArrayByKey} from "../../../../scripts/utils.js";

function Injuries({injuries, teams, areAllInjuriesOnPage, setInjuryPage}) {
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });

    return injuries.length === 0
           ? null
           : <div id={"injuries"} className={"injuriesOrTrades injuriesHome"}>
               <h2>Injuries</h2>
               <ul className={"injuriesOrTradesByDate"}>
                   {
                       splitArrayByKey(injuries, "date").map((day, index) =>
                           <li key={index} className={"individualDay"}>
                               <span className={"injuryOrTradeHeader"}>
                                   {formatterDate.format(new Date(day[0].date))}
                               </span>
                               <ul className={"injuries"}>
                                   {
                                       day.map(injury =>
                                           <li key={injury.competitorId.toString() + injury.player.id.toString()}
                                               className={"injury"}>
                                               <div className={"horizontalFlex injuryTeamAndPlayerInformation"}>
                                                   <img className={`injuryHeadshot default
                                                   ${injury.teamAbbrev} gradient`}
                                                        src={getTeamLogo(teams, injury.teamAbbrev)}
                                                        alt={`${injury.teamAbbrev}`}/>
                                                   <div className={"verticalFlex injuryInformation"}>
                                                       <div className={"verticalFlex injuryDetails"}>
                                                           <span className={"injuryName"}>
                                                               {injury.player.displayName}
                                                           </span>
                                                           <div className={"horizontalFlex injuryPlayerDetails"}>
                                                               <span>#{injury.player.number.toLocaleString()}</span>
                                                               <span>
                                                                   {getPositionTitle(injury.player.positionShort)}
                                                               </span>
                                                               <span>{injury.player.age.toLocaleString()} y/o</span>
                                                           </div>
                                                           <span>{injury.teamName}</span>
                                                       </div>
                                                       <div className={"verticalFlex injuryDetails"}>
                                                           <span>{capitalize(injury.description)}</span>
                                                           <span>{injury.status}</span>
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
                   areAllInjuriesOnPage
                   ? null
                   : <button type={"button"}
                             className={"loadMoreButton"}
                             title={"Load more"}
                             onClick={() => setInjuryPage(previousPage => previousPage + 1)}>
                       Load more
                   </button>
               }
           </div>;
}

export default Injuries;
