import constants from "../../../../../../../../data/constants.json";
import FinalTeamInfo from "./FinalTeamInfo.jsx";

function StatisticsFinal({game}) {
    const categories = ["Shots", "Face-off win percentage", "Power play", "Penalty minutes",
                        "Hits", "Blocked shots", "Giveaways", "Takeaways"];

    return <div className={"gamesContent"}>
        <h3>Statistics</h3>
        <div className={"horizontalFlex statistics"}>
            <FinalTeamInfo game={game} team={"awayTeam"} numberOfCategories={categories.length}></FinalTeamInfo>
            <div className={"verticalFlex statisticsColumn"}>
                <span className={"statisticsHeader"}>TEAM</span>
                {
                    game.gameType === constants.gameType.playoff.index
                    ? <span>Playoff series wins</span>
                    : <span>Season series wins</span>
                }
                {
                    categories.map((category, index) =>
                        <span key={category + index}>{category}</span>
                    )
                }
            </div>
            <FinalTeamInfo game={game} team={"homeTeam"} numberOfCategories={categories.length}></FinalTeamInfo>
        </div>
    </div>;
}

export default StatisticsFinal;
