import {parseSeason} from "../../../../../../scripts/parsing.js";
import {splitArrayByKey} from "../../../../../../scripts/utils.js";
import TrophyNomineeCategory from "./TrophyNomineeCategory.jsx";

function TrophyYear({season}) {

    return <div key={season.id} className={"verticalFlex trophySeasonAndWinners"}>
        {
            season[0]
            ? <span className={"trophySeason"}>{parseSeason(season[0].seasonId)}</span>
            : null
        }
        <div className={"horizontalFlex trophyStatus"}>
            {
                splitArrayByKey(season, "status").map((category, index) =>
                    <TrophyNomineeCategory key={category.toString() + index.toString()}
                                           nomineeCategory={category}>
                    </TrophyNomineeCategory>
                )
            }
        </div>
    </div>;
}

export default TrophyYear;
