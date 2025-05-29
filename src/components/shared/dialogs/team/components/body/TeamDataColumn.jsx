import {parseDecimals} from "../../../../../../scripts/parsing.js";
import {getValue} from "../../../../../../scripts/utils.js";

function TeamDataColumn({data, gameType, columnTitle, teamAbbreviation}) {
    const fallback = "N/A";
    const statistics = ["gamesPlayed", "wins", "losses", "ties", "overtimeLosses",
                        "pointPctg", "goalsFor", "goalsAgainst", "shutouts", "penaltyMinutes"];

    function format(key, object) {
        let value = getValue([key], object, false, fallback);
        if (value !== fallback && value !== null) {
            if (key === "pointPctg") {
                return parseDecimals(value, 1);
            }
            return value.toLocaleString();
        }
        return fallback;
    }

    function fillWithData(data, categories) {
        let values = [];
        if (data) {
            for (const category of categories) {
                values.push(format(category, data));
            }
        } else {
            categories.forEach(() => values.push(fallback));
        }
        return values;
    }

    function getStatistics() {
        for (let gameTypeData of data) {
            if (gameTypeData.gameTypeId === gameType) {
                return fillWithData(gameTypeData, statistics);
            }
        }
        return fillWithData(undefined, statistics);
    }

    return <>
        <div className={"verticalFlex statisticsColumn"}>
            <span className={`statisticsHeader ${teamAbbreviation} border`}>{columnTitle}</span>
            {
                getStatistics().map((statistic, index) =>
                    <span key={statistic + index.toString()}>{statistic}</span>
                )
            }
        </div>
    </>;
}

export default TeamDataColumn;
