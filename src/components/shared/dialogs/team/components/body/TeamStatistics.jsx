import constants from "../../../../../../data/constants.json";
import TeamTitleColumn from "./TeamTitleColumn.jsx";
import TeamDataColumn from "./TeamDataColumn.jsx";

function TeamStatistics({team}) {

    return team.franchiseInfo && team.franchiseInfo.length > 0
           ? <div className={"teamsContent"}>
               <h2>All-time statistics</h2>
               <div className={"horizontalFlex statistics"}>
                   <TeamDataColumn data={team.franchiseInfo}
                                   gameType={constants.gameType.season.index}
                                   columnTitle={"Season"}
                                   teamAbbreviation={team.franchiseInfo?.at(-1)?.triCode}>
                   </TeamDataColumn>
                   <TeamTitleColumn columnTitle={"Type"}
                                    teamAbbreviation={team.franchiseInfo?.at(-1)?.triCode}>
                   </TeamTitleColumn>
                   <TeamDataColumn data={team.franchiseInfo}
                                   gameType={constants.gameType.playoff.index}
                                   columnTitle={"Playoff"}
                                   teamAbbreviation={team.franchiseInfo?.at(-1)?.triCode}>
                   </TeamDataColumn>
               </div>
           </div>
           : null;
}

export default TeamStatistics;
