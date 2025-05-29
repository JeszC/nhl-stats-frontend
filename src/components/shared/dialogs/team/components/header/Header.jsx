import {getSeasonWithSeparator} from "../../../../../../scripts/parsing.js";
import {getValue} from "../../../../../../scripts/utils.js";

function Header({team}) {

    return <>
        {
            team && Object.keys(team).length > 0
            ? <>
                {
                    team.teamStats.teamLogo
                    ? <img className={`defaultImage headerImage default
                            ${team.franchiseInfo.at(-1).triCode} gradient`}
                           src={team.teamStats.teamLogo}
                           alt={`${team.franchiseInfo.at(-1).triCode} logo`}/>
                    : null
                }
                <div className={"verticalFlex"}>
                            <span>
                                {getValue(["teamName"], team.franchiseInfo.at(-1), false, "Unknown team")}
                            </span>
                    <span>{getSeasonWithSeparator(team.schedule[0].season.toString())}</span>
                </div>
            </>
            : null
        }
    </>;
}

export default Header;
