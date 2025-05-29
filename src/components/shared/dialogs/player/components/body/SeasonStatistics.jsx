import {parseTeamAbbreviation} from "../../../../../../scripts/parsing.js";
import CareerAndSeasonDataColumn from "./CareerAndSeasonDataColumn.jsx";
import CareerAndSeasonTitleColumn from "./CareerAndSeasonTitleColumn.jsx";

function SeasonStatistics({player, teamsTypes}) {

    return <div className={"horizontalFlex statistics twoColumn"}>
        <CareerAndSeasonTitleColumn position={player.position}
                                    columnTitle={"Team"}
                                    teamAbbreviation={parseTeamAbbreviation(teamsTypes.teamName.default)}>
        </CareerAndSeasonTitleColumn>
        <CareerAndSeasonDataColumn data={teamsTypes}
                                   position={player.position}
                                   columnTitle={teamsTypes.teamName.default}
                                   teamAbbreviation={parseTeamAbbreviation(teamsTypes.teamName.default)}>
        </CareerAndSeasonDataColumn>
    </div>;
}

export default SeasonStatistics;
