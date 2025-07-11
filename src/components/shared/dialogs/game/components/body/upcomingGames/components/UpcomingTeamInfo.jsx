import {getOrdinalNumber, parseDecimals, parseRecord} from "../../../../../../../../scripts/parsing.js";

function UpcomingTeamInfo({game, team}) {

    return <>
        <div className={"verticalFlex statisticsColumn"}>
            <span className={`statisticsHeader ${game[team].abbrev} border`}>{game[team].abbrev}</span>
            {
                game.matchup.seasonSeriesWins
                ? game.matchup.seasonSeriesWins.neededToWin
                  ? <span>
                      {game.matchup.seasonSeriesWins[`${team}Wins`].toLocaleString()}
                      /{game.matchup.seasonSeriesWins.neededToWin.toLocaleString()}
                  </span>
                  : <span>{game.matchup.seasonSeriesWins[`${team}Wins`].toLocaleString()}</span>
                : null
            }
            <span>{parseRecord(game[team].record)}</span>
            {
                game.matchup.playoffsRecord
                ? <span>
                    {game.matchup.playoffsRecord[team].streakType}
                    {game.matchup.playoffsRecord[team].streak.toLocaleString()}
                </span>
                : null
            }
            {
                game.matchup.last10Record
                ? <>
                    <span>{parseRecord(game.matchup.last10Record[team].record)}</span>
                    <span>
                        {game.matchup.last10Record[team].streakType}
                        {game.matchup.last10Record[team].streak.toLocaleString()}
                    </span>
                </>
                : null
            }
            {
                game.matchup.teamSeasonStats
                ? <>
                    <span>
                        {parseDecimals(game.matchup.teamSeasonStats[team]?.faceoffWinningPctg)}
                        <br/>
                        ({getOrdinalNumber(game.matchup.teamSeasonStats[team]?.faceoffWinningPctgRank)})
                    </span>
                    <span>
                        {parseDecimals(game.matchup.teamSeasonStats[team]?.ppPctg)}
                        <br/>
                        ({getOrdinalNumber(game.matchup.teamSeasonStats[team]?.ppPctgRank)})
                    </span>
                    <span>
                        {parseDecimals(game.matchup.teamSeasonStats[team]?.pkPctg)}
                        <br/>
                        ({getOrdinalNumber(game.matchup.teamSeasonStats[team]?.pkPctgRank)})
                    </span>
                    <span>
                        {parseDecimals(game.matchup.teamSeasonStats[team]?.goalsForPerGamePlayed, 1)}
                        <br/>
                        ({getOrdinalNumber(game.matchup.teamSeasonStats[team]?.goalsForPerGamePlayedRank)})
                    </span>
                    <span>
                        {parseDecimals(game.matchup.teamSeasonStats[team]?.goalsAgainstPerGamePlayed, 1)}
                        <br/>
                        ({getOrdinalNumber(game.matchup.teamSeasonStats[team]?.goalsAgainstPerGamePlayedRank)})
                    </span>
                </>
                : null
            }
            {
                game.matchup.goalieComparison
                ? <>
                    <span>{parseDecimals(game.matchup.goalieComparison[team]?.teamTotals?.savePctg)}</span>
                    <span>{game.matchup.goalieComparison[team]?.teamTotals?.shutouts.toLocaleString()}</span>
                </>
                : null
            }
        </div>
    </>;
}

export default UpcomingTeamInfo;
