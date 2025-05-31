import {getPlayer} from "../../../../../../scripts/utils.js";
import {capitalize} from "../../../../../../scripts/parsing.js";

function Injuries({injuries, teamLogo, setPlayer, setFetchState, setActiveView}) {
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        day: "2-digit", month: "2-digit", year: "numeric"
    });

    return injuries && injuries.length > 0
           ? <div className={"teamsContent injuriesOrTrades"}>
               <h2>Injuries</h2>
               <div className={"injuries"}>
                   {
                       injuries.map(injury =>
                           <button key={injury.competitorId.toString() + injury.player.id.toString()}
                                   className={"injuryTeamAndPlayerInformation horizontalFlex"}
                                   title={"Show player details"}
                                   onClick={() =>
                                       getPlayer(injury.player.nhlId, setPlayer, setFetchState, setActiveView)}>
                               <img className={`defaultImage injuryHeadshot zoom default ${injury.teamAbbrev} gradient`}
                                    src={injury.player.headshot ? injury.player.headshot : teamLogo}
                                    alt={`${injury.teamAbbrev}`}/>
                               <div className={"injuryPlayerInformation verticalFlex"}>
                                   <h3>{injury.player.displayName}</h3>
                                   <div className={"injuryPlayerRoleInformation horizontalFlex"}>
                                       <span>#{injury.player.number}</span>
                                       <span>{injury.player.positionShort}</span>
                                       <span>{injury.player.age} y/o</span>
                                   </div>
                                   <span>{formatterDate.format(new Date(injury.date))}</span>
                                   <span>{capitalize(injury.description)}</span>
                                   <span>{injury.status}</span>
                               </div>
                           </button>
                       )
                   }
               </div>
           </div>
           : null;
}

export default Injuries;
