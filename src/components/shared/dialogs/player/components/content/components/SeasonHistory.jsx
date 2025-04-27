import {useEffect, useState} from "react";
import constants from "../../../../../../../data/constants.json";
import SingleSelectionButtons from "../../../../../common/singleSelectionButtons/SingleSelectionButtons";
import SeasonStatistics from "./SeasonStatistics.jsx";

function SeasonHistory({player}) {
    const [seasons, setSeasons] = useState([]);
    const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
    const [selectedSeasonType, setSelectedSeasonType] = useState("season");

    function getSeasons() {
        let data = [];
        for (let i = 0; i < seasons.length; i++) {
            let year = seasons[i];
            let seasonData = {
                value: i,
                text: parseSeason(year[0].season),
                title: `Season ${parseSeason(year[0].season)}`
            };
            if (i === 0) {
                seasonData.default = true;
            }
            data.push(seasonData);
        }
        return data;
    }

    function getSeasonTypes() {
        let season = {
            default: true,
            value: "season",
            text: "Season",
            title: "Season"
        };
        let playoffs = {
            value: "playoffs",
            text: "Playoffs",
            title: "Playoffs"
        };
        return [season, playoffs];
    }

    function parseSeason(season) {
        return `${season.toString().slice(0, 4)}-${season.toString().slice(4)}`;
    }

    function getValidStats(seasons) {
        if (seasons.length === 0) {
            seasons.push({});
        }
        for (let season of seasons) {
            fillEmptyStatistics(season);
        }
        return seasons;
    }

    function fillEmptyStatistics(object) {
        let categories = 10;
        let keys = Object.keys(object).length;
        if (!object.teamName) {
            object.teamName = {
                default: "N/A"
            };
        }
        for (let i = 0; i < categories - keys; i++) {
            let key = `key${i}`;
            object[key] = {};
        }
    }

    function getPlayerStatsBySeason(seasonData) {
        let nhlSeasons = seasonData.filter(season => season.leagueAbbrev === "NHL");
        let years = [];
        for (let i = 0; i < nhlSeasons.length; i++) {
            let sameSeasons = [nhlSeasons[i]];
            let sum = 0;
            for (let j = i + 1; j < nhlSeasons.length; j++) {
                if (nhlSeasons[j].season === nhlSeasons[i].season) {
                    sameSeasons.push(nhlSeasons[j]);
                    sum++;
                } else {
                    break;
                }
            }
            i += sum;
            years.push(sameSeasons);
        }
        years.reverse();
        setSeasons(years);
    }

    function getSeasonalStats() {
        getPlayerStatsBySeason(player.seasonTotals);
    }

    useEffect(getSeasonalStats, [player.seasonTotals]);

    return seasons.length > 0
           ? <div className={"teamsContent"}>
               <h2>Season history</h2>
               <div className={"horizontalFlex seasonHistory"}>
                   <div className={"verticalFlex seasonButtons"}>
                       <SingleSelectionButtons buttonData={getSeasons()}
                                               setData={setSelectedSeasonIndex}
                                               classes={"seasonButton"}>
                       </SingleSelectionButtons>
                   </div>
                   <div className={"verticalFlex seasonStats"}>
                       <div className={"horizontalFlex seasonStatsTabs tabs teamsTabs"}>
                           <SingleSelectionButtons buttonData={getSeasonTypes()}
                                                   setData={setSelectedSeasonType}
                                                   classes={"tab teamsTab"}>
                           </SingleSelectionButtons>
                       </div>
                       {
                           selectedSeasonType === "season"
                           ? getValidStats(seasons[selectedSeasonIndex]
                               .filter(teamsTypes => teamsTypes.gameTypeId === constants.gameType.season.index))
                               .map(teamsTypes =>
                                   <SeasonStatistics key={teamsTypes.teamName.default}
                                                     player={player}
                                                     teamsTypes={teamsTypes}>
                                   </SeasonStatistics>
                               )
                           : getValidStats(seasons[selectedSeasonIndex]
                               .filter(teamsTypes => teamsTypes.gameTypeId === constants.gameType.playoff.index))
                               .map(teamsTypes =>
                                   <SeasonStatistics key={teamsTypes.teamName}
                                                     player={player}
                                                     teamsTypes={teamsTypes}>
                                   </SeasonStatistics>
                               )
                       }
                   </div>
               </div>
           </div>
           : null;
}

export default SeasonHistory;
