import HTMLParser from "html-react-parser";
import {splitArrayByKey} from "../../../../../../scripts/utils.js";
import TrophyYear from "./TrophyYear.jsx";

function Trophy({trophy, trophyWinners, setPlayer, setFetchState, setActiveView}) {

    return <div className={"horizontalFlex trophyImageAndDescription"}>
        <img className={"trophyImage"} src={trophy?.imageUrl} alt={trophy?.name}/>
        <div className={"verticalFlex trophyDescription"}>
            {
                trophy?.description
                ? <div>{HTMLParser(trophy.description)}</div>
                : null
            }
            <div className={"verticalFlex trophyWinners"}>
                {
                    trophy
                    ? splitArrayByKey(trophyWinners, "seasonId").map((season, index) =>
                        <TrophyYear key={season.length.toString() + index.toString()}
                                    season={season}
                                    setPlayer={setPlayer}
                                    setFetchState={setFetchState}
                                    setActiveView={setActiveView}>
                        </TrophyYear>
                    )
                    : null
                }
            </div>
        </div>
    </div>;
}

export default Trophy;
