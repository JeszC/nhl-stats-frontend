import GoalieTable from "./GoalieTable.jsx";
import SkaterTable from "./SkaterTable.jsx";

function PlayerStatistics({game, setPlayer, setActiveView, setPreviousView, setFetchState}) {

    function getSkaters(team) {
        let skaters = game.summary.playerByGameStats[team];
        return skaters.defense.concat(skaters.forwards);
    }

    return <>
        <details className={"gamesContent"} open>
            <summary className={"gamesTitle"}>Skaters</summary>
            <div className={"skaterGoalieTables"}>
                <SkaterTable skaters={getSkaters("awayTeam")}
                             team={game.awayTeam.abbrev}
                             setPlayer={setPlayer}
                             setActiveView={setActiveView}
                             setPreviousView={setPreviousView}
                             setFetchState={setFetchState}>
                </SkaterTable>
                <SkaterTable skaters={getSkaters("homeTeam")}
                             team={game.homeTeam.abbrev}
                             setPlayer={setPlayer}
                             setActiveView={setActiveView}
                             setPreviousView={setPreviousView}
                             setFetchState={setFetchState}>
                </SkaterTable>
            </div>
        </details>
        <details className={"gamesContent"} open>
            <summary className={"gamesTitle"}>Goalies</summary>
            <div className={"skaterGoalieTables"}>
                <GoalieTable goalies={game.summary.playerByGameStats.awayTeam.goalies}
                             team={game.awayTeam.abbrev}
                             setPlayer={setPlayer}
                             setActiveView={setActiveView}
                             setPreviousView={setPreviousView}
                             setFetchState={setFetchState}>
                </GoalieTable>
                <GoalieTable goalies={game.summary.playerByGameStats.homeTeam.goalies}
                             team={game.homeTeam.abbrev}
                             setPlayer={setPlayer}
                             setActiveView={setActiveView}
                             setPreviousView={setPreviousView}
                             setFetchState={setFetchState}>
                </GoalieTable>
            </div>
        </details>
    </>;
}

export default PlayerStatistics;
