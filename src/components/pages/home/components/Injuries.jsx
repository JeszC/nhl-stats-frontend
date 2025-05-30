import {capitalize} from "../../../../scripts/parsing.js";

function Injuries({injuries, teams}) {
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

    return injuries.length === 0
           ? null
           : <div id={"injuries"} className={"injuriesOrTrades injuriesHome"}>
               <h2>Injuries</h2>
               <ul className={"injuriesDates"}>
                   {
                       splitArrayByKey(injuries, "date").map((item, index) =>
                           <li key={index} className={"injuryDate"}>
                               <span className={"injuryDateHeader"}>
                                   {formatterDate.format(new Date(item[0].date))}
                               </span>
                               <ul className={"injuries"}>
                                   {
                                       item.map(injury =>
                                           <li key={injury.competitorId.toString() + injury.player.id.toString()}
                                               className={"injury"}>
                                               <div className={"injuryTeamAndPlayerInformation horizontalFlex"}>
                                                   <img className={`injuryHeadshot default
                                                   ${injury.teamAbbrev} gradient`}
                                                        src={getTeamLogo(injury.teamAbbrev)}
                                                        alt={`${injury.teamAbbrev}`}/>
                                                   <div className={"injuryPlayerInformation verticalFlex"}>
                                                       <span className={"injuryName"}>{injury.player.displayName}</span>
                                                       <div className={"injuryPlayerRoleInformation horizontalFlex"}>
                                                           <span>#{injury.player.number}</span>
                                                           <span>{injury.player.positionShort}</span>
                                                           <span>{injury.player.age} y/o</span>
                                                       </div>
                                                       <span>{injury.teamName}</span>
                                                       <span>{capitalize(injury.description)}</span>
                                                       <span>{injury.status}</span>
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
           </div>;
}

export default Injuries;
