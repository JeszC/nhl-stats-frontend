import Chart from "./components/Chart.jsx";
import Officials from "./components/Officials.jsx";
import Penalties from "./components/Penalties.jsx";
import PlayerStatistics from "./components/PlayerStatistics.jsx";
import Scoring from "./components/Scoring.jsx";
import Scratches from "./components/Scratches.jsx";
import Staff from "./components/Staff.jsx";
import StatisticsFinal from "./components/StatisticsFinal.jsx";
import ThreeStars from "./components/ThreeStars.jsx";

function PlayedGames({game, setPlayer, setActiveView, setPreviousView, setFetchState}) {

    return <>
        <ThreeStars game={game}
                    setPlayer={setPlayer}
                    setActiveView={setActiveView}
                    setPreviousView={setPreviousView}
                    setFetchState={setFetchState}>
        </ThreeStars>
        <StatisticsFinal game={game}></StatisticsFinal>
        <Chart game={game}></Chart>
        <Scratches game={game}
                   setPlayer={setPlayer}
                   setActiveView={setActiveView}
                   setPreviousView={setPreviousView}
                   setFetchState={setFetchState}>
        </Scratches>
        <Staff game={game}></Staff>
        <Officials game={game}></Officials>
        <Scoring game={game}
                 setPlayer={setPlayer}
                 setActiveView={setActiveView}
                 setPreviousView={setPreviousView}
                 setFetchState={setFetchState}>
        </Scoring>
        <Penalties game={game}
                   setPlayer={setPlayer}
                   setActiveView={setActiveView}
                   setPreviousView={setPreviousView}
                   setFetchState={setFetchState}>
        </Penalties>
        <PlayerStatistics game={game}
                          setPlayer={setPlayer}
                          setActiveView={setActiveView}
                          setPreviousView={setPreviousView}
                          setFetchState={setFetchState}>
        </PlayerStatistics>
    </>;
}

export default PlayedGames;
