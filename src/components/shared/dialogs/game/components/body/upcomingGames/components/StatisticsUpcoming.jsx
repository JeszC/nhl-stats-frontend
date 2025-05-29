import constants from "../../../../../../../../data/constants.json";
import UpcomingTeamInfo from "./UpcomingTeamInfo.jsx";

function StatisticsUpcoming({game}) {

    return <div className={"gamesContent"}>
        <h3>Statistics</h3>
        <div className={"horizontalFlex statistics"}>
            <UpcomingTeamInfo game={game} team={"awayTeam"}></UpcomingTeamInfo>
            <div className={"verticalFlex statisticsColumn"}>
                <span className={"statisticsHeader"}>TEAM</span>
                {
                    game.matchup.seasonSeriesWins
                    ? game.gameType === constants.gameType.playoff.index
                      ? <span>Playoff series wins</span>
                      : <span>Season series wins</span>
                    : null
                }
                {
                    game.gameType === constants.gameType.playoff.index
                    ? <span>Playoff record</span>
                    : <span>Season record</span>
                }
                {
                    game.matchup.playoffsRecord
                    ? <span>Playoff streak</span>
                    : null
                }
                {
                    game.matchup.last10Record
                    ? <>
                        <span>Last ten games</span>
                        <span>Streak</span>
                    </>
                    : null
                }
                {
                    game.matchup.teamSeasonStats
                    ? <>
                        <span>Face-off win percentage</span>
                        <span>Power play percentage</span>
                        <span>Penalty kill percentage</span>
                        <span>Goals for per game</span>
                        <span>Goals against per game</span>
                    </>
                    : null
                }
                {
                    game.matchup.goalieComparison
                    ? <>
                        <span>Save percentage</span>
                        <span>Shutouts</span>
                    </>
                    : null
                }
            </div>
            <UpcomingTeamInfo game={game} team={"homeTeam"}></UpcomingTeamInfo>
        </div>
    </div>;
}

export default StatisticsUpcoming;
