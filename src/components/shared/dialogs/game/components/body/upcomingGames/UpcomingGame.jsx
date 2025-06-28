import GoalieComparison from "./components/GoalieComparison.jsx";
import LastFiveLeaders from "./components/LastFiveLeaders.jsx";
import StatisticsUpcoming from "./components/StatisticsUpcoming.jsx";

function UpcomingGame({game, setPlayer, setActiveView, setPreviousView, setFetchState}) {

    return <>
        <StatisticsUpcoming game={game}></StatisticsUpcoming>
        <LastFiveLeaders game={game}
                         setPlayer={setPlayer}
                         setActiveView={setActiveView}
                         setPreviousView={setPreviousView}
                         setFetchState={setFetchState}>
        </LastFiveLeaders>
        <GoalieComparison game={game}
                          setPlayer={setPlayer}
                          setActiveView={setActiveView}
                          setPreviousView={setPreviousView}
                          setFetchState={setFetchState}>
        </GoalieComparison>
    </>;
}

export default UpcomingGame;
