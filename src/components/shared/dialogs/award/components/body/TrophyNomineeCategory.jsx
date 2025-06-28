import {capitalize, getPositionTitle} from "../../../../../../scripts/parsing.js";
import awardIcon from "../../../../images/Person.svg";

function TrophyNomineeCategory({nomineeCategory}) {

    function parseCategoryTitle(category) {
        return capitalize(category.replace("_", "-").toLowerCase());
    }

    function getSeasonLogo(nominee) {
        if (nominee?.team) {
            let placeHolder;
            for (let logo of nominee.team.logos) {
                if (nominee.seasonId >= logo.startSeason && nominee.seasonId <= logo.endSeason) {
                    if (logo.background === "light") {
                        return logo.secureUrl;
                    } else if (logo.background === "dark") {
                        placeHolder = logo.secureUrl;
                    }
                }
            }
            if (placeHolder) {
                return placeHolder;
            }
        }
        return awardIcon;
    }

    return <div className={"verticalFlex trophySingleStatus"}>
        {
            nomineeCategory[0]
            ? <span className={"trophyCategory"}>{parseCategoryTitle(nomineeCategory[0].status)}</span>
            : null
        }
        {
            nomineeCategory.map(nominee =>
                <div key={nominee.id} className={"horizontalFlex trophyNominee"}>
                    <img className={nominee.team?.logos[0]?.secureUrl
                                    ? `defaultImage default ${nominee.team?.triCode} gradient trophyNomineeImage`
                                    : `defaultImage default gradient trophyNomineeImage missingImage`}
                         src={getSeasonLogo(nominee)}
                         alt={`${nominee.team?.triCode} logo`}/>
                    <div className={"verticalFlex trophyStatusInformation"}>
                        <span className={"trophyStatusName"}>{nominee.fullName}</span>
                        {
                            nominee.fullName === `${nominee.team?.placeName} ${nominee.team?.commonName}`
                            ? null
                            : nominee.team?.placeName && nominee.team?.commonName
                              ? <span className={"trophyStatusTeam"}>
                                  {`${nominee.team?.placeName} ${nominee.team?.commonName}`}
                              </span>
                              : null
                        }
                        {
                            nominee.player?.position
                            ? <span>{getPositionTitle(nominee.player.position)}</span>
                            : null
                        }
                        {
                            nominee.coach && nominee.trophyCategoryId !== 3 && nominee.trophyId !== 2
                            ? <>
                                <span className={"trophyStatusTeam"}>
                                    {`${nominee.coach.firstName} ${nominee.coach.lastName}`}
                                </span>
                                <span>Coach</span>
                            </>
                            : null
                        }
                    </div>
                </div>
            )
        }
    </div>;
}

export default TrophyNomineeCategory;
