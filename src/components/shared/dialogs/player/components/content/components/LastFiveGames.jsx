import {parseDecimals, parseIceTime} from "../../../../../../../scripts/parsing.js";
import {getValue} from "../../../../../../../scripts/utils.js";

function LastFiveGames({player}) {
    const fallback = "N/A";

    return player.last5Games.length > 0
           ? <div className={"teamsContent"}>
               <h2>Last five games</h2>
               <div className={"scrollableTable"}>
                   {
                       player.position === "G"
                       ? <table className={"lastFiveTable"} aria-label={"Last five games table"}>
                           <thead>
                               <tr>
                                   <th title={"Date"}>Date</th>
                                   <th title={"Team"}>Team</th>
                                   <th title={"Opponent"}>Opp</th>
                                   <th title={"Decision"}>Dec</th>
                                   <th title={"Goals against"}>GA</th>
                                   <th title={"Shots against"}>SA</th>
                                   <th title={"Save percentage"}>SV%</th>
                                   <th title={"Penalty minutes"}>PIM</th>
                                   <th title={"Time on ice"}>TOI</th>
                               </tr>
                           </thead>
                           <tbody>
                               {
                                   player.last5Games.map(game =>
                                       <tr key={game.gameDate}>
                                           <td>
                                               {
                                                   new Date(game.startTimeUTC).toLocaleDateString([], {
                                                       day: "2-digit",
                                                       month: "2-digit",
                                                       year: "numeric"
                                                   })
                                               }
                                           </td>
                                           <td>{getValue(["teamAbbrev"], game, false, fallback)}</td>
                                           <td>{getValue(["opponentAbbrev"], game, false, fallback)}</td>
                                           <td>{getValue(["decision"], game, false, fallback)}</td>
                                           <td>{getValue(["goalsAgainst"], game, false, fallback).toLocaleString()}</td>
                                           <td>{getValue(["shotsAgainst"], game, false, fallback).toLocaleString()}</td>
                                           <td>
                                               {game.savePctg === undefined ? fallback : parseDecimals(game.savePctg)}
                                           </td>
                                           <td>{getValue(["penaltyMins"], game, false, fallback).toLocaleString()}</td>
                                           <td>{parseIceTime(game.toi)}</td>
                                       </tr>
                                   )
                               }
                           </tbody>
                       </table>
                       : <table className={"lastFiveTable"} aria-label={"Last five games table"}>
                           <thead>
                               <tr>
                                   <th title={"Date"}>Date</th>
                                   <th title={"Team"}>Team</th>
                                   <th title={"Opponent"}>Opp</th>
                                   <th title={"Points"}>P</th>
                                   <th title={"Goals"}>G</th>
                                   <th title={"Assists"}>A</th>
                                   <th title={"Plus/minus"}>+/-</th>
                                   <th title={"Penalty minutes"}>PIM</th>
                                   <th title={"Shots"}>S</th>
                                   <th title={"Shifts"}>SHF</th>
                                   <th title={"Time on ice"}>TOI</th>
                               </tr>
                           </thead>
                           <tbody>
                               {
                                   player.last5Games.map(game =>
                                       <tr key={game.gameDate}>
                                           <td>
                                               {
                                                   new Date(game.startTimeUTC).toLocaleDateString([], {
                                                       day: "2-digit",
                                                       month: "2-digit",
                                                       year: "numeric"
                                                   })
                                               }
                                           </td>
                                           <td>{getValue(["teamAbbrev"], game, false, fallback)}</td>
                                           <td>{getValue(["opponentAbbrev"], game, false, fallback)}</td>
                                           <td>{getValue(["points"], game, false, fallback).toLocaleString()}</td>
                                           <td>{getValue(["goals"], game, false, fallback).toLocaleString()}</td>
                                           <td>{getValue(["assists"], game, false, fallback).toLocaleString()}</td>
                                           <td>{getValue(["plusMinus"], game, false, fallback).toLocaleString()}</td>
                                           <td>{getValue(["pim"], game, false, fallback).toLocaleString()}</td>
                                           <td>{getValue(["shots"], game, false, fallback).toLocaleString()}</td>
                                           <td>{getValue(["shifts"], game, false, fallback).toLocaleString()}</td>
                                           <td>{parseIceTime(game.toi)}</td>
                                       </tr>
                                   )
                               }
                           </tbody>
                       </table>
                   }
               </div>
           </div>
           : null;
}

export default LastFiveGames;
