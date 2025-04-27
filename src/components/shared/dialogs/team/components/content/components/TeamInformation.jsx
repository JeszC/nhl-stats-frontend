import {formatAndParseRecord, getOrdinalNumber, getSeasonWithSeparator} from "../../../../../../../scripts/parsing.js";
import {getValue} from "../../../../../../../scripts/utils.js";

function TeamInformation({selectedTeam, recordFormat, lastTenFormat}) {
    const fallback = "N/A";

    function getClassName() {
        let teamAbbrev = selectedTeam.franchiseInfo?.at(-1)?.triCode;
        if (teamAbbrev) {
            return `default ${teamAbbrev} gradient`;
        }
        return "default gradient";
    }

    function getRecord(values) {
        let numericValues = [];
        for (let value of values) {
            if (selectedTeam.teamStats[value] === undefined) {
                return fallback;
            }
            let numericValue = getValue([value], selectedTeam.teamStats, false, 0);
            numericValues.push(numericValue);
        }
        return formatAndParseRecord(numericValues);
    }

    return <div className={`playerInformationBanner ${getClassName()}`}>
        <div className={"horizontalFlex playersBanner"}>
            {
                selectedTeam.teamStats.teamLogo
                ? <img className={`defaultImage playersImage ${getClassName()}`}
                       src={selectedTeam.teamStats.teamLogo}
                       alt={`${selectedTeam.franchiseInfo.at(-1).triCode} logo`}/>
                : null
            }
            <div className={"verticalFlex playersInformation"}>
                <div>
                    <h2>{getValue(["teamName"], selectedTeam.franchiseInfo.at(-1), false, "Unknown team")}</h2>
                    {
                        selectedTeam.teamStats.leagueSequence
                        ? <span>{getOrdinalNumber(selectedTeam.teamStats.leagueSequence)} overall</span>
                        : null
                    }
                </div>
                <div>
                    <h4>First season</h4>
                    <span>
                    {
                        selectedTeam.franchiseInfo[0]?.firstSeasonId
                        ? getSeasonWithSeparator(selectedTeam.franchiseInfo[0]?.firstSeasonId.toString())
                        : fallback
                    }
                    </span>
                </div>
                <div>
                    <h4>Stanley Cups</h4>
                    <span>{getValue(["cups"], selectedTeam.franchiseInfo[0], false, fallback).toLocaleString()}</span>
                </div>
            </div>
        </div>
        <div className={"playersStatistics"}>
            <div className={"verticalFlex"}>
                <h4>Conference</h4>
                <span>
                    {
                        selectedTeam.teamStats.conferenceName && selectedTeam.teamStats.conferenceSequence
                        ? `${selectedTeam.teamStats.conferenceName}
                        (${getOrdinalNumber(selectedTeam.teamStats.conferenceSequence)})`
                        : fallback
                    }
                </span>
            </div>
            <div className={"verticalFlex"}>
                <h4>Division</h4>
                <span>
                    {
                        selectedTeam.teamStats.divisionName && selectedTeam.teamStats.divisionSequence
                        ? `${selectedTeam.teamStats.divisionName}
                        (${getOrdinalNumber(selectedTeam.teamStats.divisionSequence)})`
                        : fallback
                    }
                </span>
            </div>
            <div className={"verticalFlex"}>
                <h4>Games</h4>
                <span>{getValue(["gamesPlayed"], selectedTeam.teamStats, false, fallback).toLocaleString()}</span>
            </div>
            <div className={"verticalFlex"}>
                <h4>Points</h4>
                <span>{getValue(["points"], selectedTeam.teamStats, false, fallback).toLocaleString()}</span>
            </div>
            <div className={"verticalFlex"}>
                <h4>Goal differential</h4>
                <span>{getValue(["goalDifferential"], selectedTeam.teamStats, false, fallback).toLocaleString()}</span>
            </div>
            <div className={"verticalFlex"}>
                <h4>Record</h4>
                <span>{getRecord(recordFormat)}</span>
            </div>
            <div className={"verticalFlex"}>
                <h4>Last ten games</h4>
                <span>{getRecord(lastTenFormat)}</span>
            </div>
            <div className={"verticalFlex"}>
                <h4>Streak</h4>
                <span>
                    {
                        selectedTeam.teamStats.streakCode && selectedTeam.teamStats.streakCount !== undefined
                        ? `${selectedTeam.teamStats.streakCode}${selectedTeam.teamStats.streakCount.toLocaleString()}`
                        : fallback
                    }
                </span>
            </div>
        </div>
    </div>;
}

export default TeamInformation;
