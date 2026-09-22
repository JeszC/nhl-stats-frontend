import Official from "./Official.jsx";

function Officials({game}) {

    return <details className={"gamesContent"} open>
        <summary className={"gamesTitle"}>Officials</summary>
        <div className={"periodInformation"}>
            {
                game.summary.gameInfo.referees.map((referee, index) =>
                    <Official key={referee.fullName.default + index.toString()}
                              official={referee}
                              type="Referee">
                    </Official>
                )
            }
            {
                game.summary.gameInfo.linesmen.map((linesman, index) =>
                    <Official key={linesman.fullName.default + index.toString()}
                              official={linesman}
                              type="Linesman">
                    </Official>
                )
            }
        </div>
    </details>;
}

export default Officials;
