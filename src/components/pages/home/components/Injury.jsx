import {capitalize, getPositionTitle} from "../../../../scripts/parsing.js";
import {getTeamLogo} from "../../../../scripts/utils.js";

function Injury({injury, teams}) {

    return <div className={"horizontalFlex injuryTeamAndPlayerInformation"}>
        <img className={`injuryHeadshot default ${injury.teamAbbrev} gradient`}
             src={getTeamLogo(teams, injury.teamAbbrev)}
             alt={`${injury.teamAbbrev}`}/>
        <div className={"verticalFlex injuryInformation"}>
            <div className={"verticalFlex injuryDetails"}>
                <span className={"injuryName"}>{injury.player.displayName}</span>
                <div className={"horizontalFlex injuryPlayerDetails"}>
                    <span>#{injury.player.number.toLocaleString()}</span>
                    <span>{getPositionTitle(injury.player.positionShort)}</span>
                    <span>{injury.player.age.toLocaleString()} y/o</span>
                </div>
                <span>{injury.teamName}</span>
            </div>
            <div className={"verticalFlex injuryDetails"}>
                <span>{capitalize(injury.description)}</span>
                <span>{injury.status}</span>
            </div>
        </div>
    </div>;
}

export default Injury;
