import {parseSeason} from "../../../../scripts/parsing.js";
import {splitArrayByKey} from "../../../../scripts/utils.js";
import TrophyNomineeCategory from "./TrophyNomineeCategory.jsx";

function TrophyYear({season, setPlayer, setFetchState, setActiveView}) {

    return <div key={season.id} className={"horizontalFlex trophySeasonAndWinners"}>
        {
            season[0]
            ? <span className={"trophySeason"}>{parseSeason(season[0].seasonId)}</span>
            : null
        }
        <div className={"horizontalFlex trophyStatus"}>
            {
                splitArrayByKey(season, "status")?.map(category =>
                    <TrophyNomineeCategory nomineeCategory={category}
                                           setPlayer={setPlayer}
                                           setFetchState={setFetchState}
                                           setActiveView={setActiveView}>
                    </TrophyNomineeCategory>
                )
            }
        </div>
    </div>;
}

export default TrophyYear;
