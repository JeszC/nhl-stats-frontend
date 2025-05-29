import {getValue} from "../../../../../../scripts/utils.js";
import {parseDecimals, parseGoalieIceTime, parseIceTime} from "../../../../../../scripts/parsing.js";

function CareerAndSeasonDataColumn({data, position, columnTitle, teamAbbreviation}) {
    const fallback = "N/A";

    return <>
        <div className={"verticalFlex statisticsColumn"}>
            <span className={`statisticsHeader ${teamAbbreviation} border`}>{columnTitle}</span>
            {
                position === "G"
                ? <>
                    <span>{getValue(["gamesPlayed"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["wins"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["losses"], data, false, fallback).toLocaleString()}</span>
                    {
                        data?.savePctg === undefined
                        ? <span>{fallback}</span>
                        : <span>{parseDecimals(getValue(["savePctg"], data, false, fallback))}</span>
                    }
                    {
                        data?.goalsAgainstAvg === undefined
                        ? <span>{fallback}</span>
                        : <span>{parseDecimals(getValue(["goalsAgainstAvg"], data, false, fallback), 1)}</span>
                    }
                    <span>{getValue(["shutouts"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["pim"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["goals"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["assists"], data, false, fallback).toLocaleString()}</span>
                    {
                        data?.timeOnIce === undefined
                        ? <span>{fallback}</span>
                        : <span>
                            {parseGoalieIceTime(getValue(["timeOnIce"], data, false, fallback), data.gamesPlayed)}
                        </span>
                    }
                </>
                : <>
                    <span>{getValue(["gamesPlayed"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["points"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["goals"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["assists"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["plusMinus"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["pim"], data, false, fallback).toLocaleString()}</span>
                    <span>{getValue(["shots"], data, false, fallback).toLocaleString()}</span>
                    {
                        data?.shootingPctg === undefined
                        ? <span>{fallback}</span>
                        : <span>{parseDecimals(getValue(["shootingPctg"], data, false, fallback))}</span>
                    }
                    {
                        data?.faceoffWinningPctg === undefined
                        ? <span>{fallback}</span>
                        : <span>{parseDecimals(getValue(["faceoffWinningPctg"], data, false, fallback))}</span>
                    }
                    {
                        data?.avgToi === undefined
                        ? <span>{fallback}</span>
                        : <span>{parseIceTime(getValue(["avgToi"], data, false, fallback))}</span>
                    }
                </>
            }
        </div>
    </>;
}

export default CareerAndSeasonDataColumn;
