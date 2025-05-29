import CareerAndSeasonDataColumn from "./CareerAndSeasonDataColumn.jsx";
import CareerAndSeasonTitleColumn from "./CareerAndSeasonTitleColumn.jsx";

function CareerStatistics({player}) {

    return player.careerTotals
           ? <div className={"teamsContent"}>
               <h2>Career statistics</h2>
               <div className={"horizontalFlex statistics"}>
                   <CareerAndSeasonDataColumn data={player.careerTotals.regularSeason}
                                              position={player.position}
                                              columnTitle={"Season"}
                                              teamAbbreviation={player.currentTeamAbbrev}>
                   </CareerAndSeasonDataColumn>
                   <CareerAndSeasonTitleColumn position={player.position}
                                               columnTitle={"Type"}
                                               teamAbbreviation={player.currentTeamAbbrev}>
                   </CareerAndSeasonTitleColumn>
                   <CareerAndSeasonDataColumn data={player.careerTotals.playoffs}
                                              position={player.position}
                                              columnTitle={"Playoff"}
                                              teamAbbreviation={player.currentTeamAbbrev}>
                   </CareerAndSeasonDataColumn>
               </div>
           </div>
           : null;
}

export default CareerStatistics;
