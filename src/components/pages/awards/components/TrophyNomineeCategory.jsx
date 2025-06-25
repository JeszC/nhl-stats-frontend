import {getPlayer} from "../../../../scripts/utils.js";
import {capitalize, getPositionTitle} from "../../../../scripts/parsing.js";
import awardIcon from "../../../shared/images/Person.svg";

function TrophyNomineeCategory({nomineeCategory, setPlayer, setFetchState, setActiveView}) {

    function parseCategoryTitle(category) {
        return capitalize(category.replace("_", "-").toLowerCase());
    }

    return <div className={"verticalFlex trophySingleStatus"}>
        {
            nomineeCategory[0]
            ? <span className={"trophyCategory"}>{parseCategoryTitle(nomineeCategory[0].status)}</span>
            : null
        }
        {
            nomineeCategory.map(nominee =>
                <button key={nominee.id}
                        className={"horizontalFlex trophyNomineeButton"}
                        type={"button"}
                        title={"Show player details"}
                        onClick={() => getPlayer(nominee.playerId, setPlayer, setFetchState, setActiveView)}>
                    <img className={nominee.team?.logos[0]?.secureUrl
                                    ? `defaultImage default zoom ${nominee.team?.triCode} gradient trophyNomineeImage`
                                    : `defaultImage default zoom gradient trophyNomineeImage missingImage`}
                         src={nominee.team?.logos[0]?.secureUrl ? nominee.team?.logos[0]?.secureUrl : awardIcon}
                         alt={`${nominee.team?.triCode} logo`}/>
                    <div className={"verticalFlex trophyStatusInformation"}>
                        <span className={"trophyStatusName"}>{nominee.fullName}</span>
                        {
                            nominee.fullName === `${nominee.team?.placeName} ${nominee.team?.commonName}`
                            ? null
                            : nominee.team?.placeName && nominee.team?.commonName
                              ? `${nominee.team?.placeName} ${nominee.team?.commonName}`
                              : null
                        }
                        {
                            nominee.player?.position
                            ? <span>{getPositionTitle(nominee.player.position)}</span>
                            : null
                        }
                    </div>
                </button>
            )
        }
    </div>;
}

export default TrophyNomineeCategory;
