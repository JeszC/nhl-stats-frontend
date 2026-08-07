import {fixAbbreviation} from "../../../../scripts/parsing.js";
import {getTeamLogo, getTeamName} from "../../../../scripts/utils.js";

function Signing({signing, teams}) {
    function fixAbbrev(team) {
        return fixAbbreviation(team?.team_shortname);
    }

    function fixPositionTitle(positionTitle) {
        switch (positionTitle) {
            case "Left Wing":
                return "Left Winger";
            case "Right Wing":
                return "Right Winger";
            case "Defense":
                return "Defender";
            default:
                return positionTitle;
        }
    }

    return <div className={"horizontalFlex signingImageAndInformation"}>
        <img className={`signingLogo default ${fixAbbrev(signing)} gradient`}
             src={getTeamLogo(teams, fixAbbrev(signing))}
             alt={`${signing.team_shortname} logo`}/>
        <div className={"verticalFlex signingInformation"}>
            <div className={"verticalFlex signingDetails"}>
                <span className={"signingInformationTitle"}>{signing.name}</span>
                <div className={"horizontalFlex signingPlayerDetails"}>
                    <span>
                        {
                            signing.player_position
                            ? fixPositionTitle(signing.player_position)
                            : "N/A"
                        }
                    </span>
                    <span>
                        {
                            signing.age
                            ? signing.age.toLocaleString()
                            : "N/A"
                        } y/o
                    </span>
                </div>
                <span>{getTeamName(teams, fixAbbrev(signing))}</span>
            </div>
            <div className={"verticalFlex signingDetails"}>
                <span>{signing.contract_details[1].value}, {signing.contract_details[0].value}</span>
                <span>{signing.contract_details[2].value} AAV</span>
                <span>{signing.contract_details[3].value} Total</span>
            </div>
        </div>
    </div>;
}

export default Signing;
