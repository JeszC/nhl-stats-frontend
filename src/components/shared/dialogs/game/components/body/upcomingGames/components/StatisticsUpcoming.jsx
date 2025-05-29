import StatisticsColumn from "./StatisticsColumn.jsx";
import UpcomingTeamInfo from "./UpcomingTeamInfo.jsx";

function StatisticsUpcoming({game}) {

    return <div className={"gamesContent"}>
        <h3>Statistics</h3>
        <div className={"horizontalFlex statistics"}>
            <UpcomingTeamInfo game={game} team={"awayTeam"}></UpcomingTeamInfo>
            <StatisticsColumn game={game}></StatisticsColumn>
            <UpcomingTeamInfo game={game} team={"homeTeam"}></UpcomingTeamInfo>
        </div>
    </div>;
}

export default StatisticsUpcoming;
