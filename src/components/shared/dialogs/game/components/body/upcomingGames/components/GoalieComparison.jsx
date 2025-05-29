import TeamGoalies from "./TeamGoalies.jsx";

function goalieComparison({game, setPlayer, setActiveView, setPreviousView, setFetchState}) {

    return <div className={"gamesContent"}>
        <h3>Goalie comparison</h3>
        <div className={"horizontalFlex statistics"}>
            <TeamGoalies game={game}
                         isAway={true}
                         setPlayer={setPlayer}
                         setActiveView={setActiveView}
                         setPreviousView={setPreviousView}
                         setFetchState={setFetchState}>
            </TeamGoalies>
            <TeamGoalies game={game}
                         isAway={false}
                         setPlayer={setPlayer}
                         setActiveView={setActiveView}
                         setPreviousView={setPreviousView}
                         setFetchState={setFetchState}>
            </TeamGoalies>
        </div>
    </div>;
}

export default goalieComparison;
