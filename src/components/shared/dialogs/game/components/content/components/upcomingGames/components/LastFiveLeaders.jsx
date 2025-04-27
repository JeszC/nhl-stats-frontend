import LastFiveLeader from "./LastFiveLeader.jsx";

function LastFiveLeaders({game, setPlayer, setActiveView, setPreviousView, setFetchState}) {

    return <div className={"gamesContent"}>
        <h3>Leaders (last five games)</h3>
        <div className={"horizontalFlex statistics"}>
            <LastFiveLeader game={game}
                            isAway={true}
                            setPlayer={setPlayer}
                            setActiveView={setActiveView}
                            setPreviousView={setPreviousView}
                            setFetchState={setFetchState}>
            </LastFiveLeader>
            <div className={"verticalFlex statisticsColumn"}>
                <span className={"statisticsHeader"}>TEAM</span>
                {
                    game.matchup.skaterComparison.leaders.map(category =>
                        <div className={"horizontalFlex singlePlayer"} key={category.category}>
                            <span className={"singlePlayerText lastFiveLeaderCategory"}>{category.category}</span>
                        </div>
                    )
                }
            </div>
            <LastFiveLeader game={game}
                            isAway={false}
                            setPlayer={setPlayer}
                            setActiveView={setActiveView}
                            setPreviousView={setPreviousView}
                            setFetchState={setFetchState}>
            </LastFiveLeader>
        </div>
    </div>;
}

export default LastFiveLeaders;
