import coachIndicator from "../../../../../images/Coach.svg";

function Staff({game}) {

    return <details className={"gamesContent"} open>
        <summary className={"gamesTitle"}>Staff</summary>
        <div className={"teamSeparatedInformation"}>
            <div className={"periodInformation"}>
                <div className={"horizontalFlex playerInformation"}>
                    <div>
                        <img className={`defaultImage gamesImage teamColorLayer 
                        default ${game.awayTeam.abbrev} gradient`} alt={""}/>
                        <img className={`defaultImage gamesImage default ${game.awayTeam.abbrev} layerImage`}
                             src={coachIndicator}
                             alt={game.summary.gameInfo.awayTeam.headCoach
                                  ? `${game.summary.gameInfo.awayTeam.headCoach.default} headshot`
                                  : `${game.awayTeam.abbrev} head coach headshot`}/>
                    </div>
                    <div className={"verticalFlex"}>
                        {
                            game.summary.gameInfo.awayTeam.headCoach
                            ? <span className={"primary"}>{game.summary.gameInfo.awayTeam.headCoach.default}</span>
                            : null
                        }
                        <span className={"secondary"}>Head coach</span>
                        <div className={"horizontalFlex stats"}>
                            <span>{game.awayTeam.abbrev}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"periodInformation"}>
                <div className={"horizontalFlex playerInformation"}>
                    <div>
                        <img className={`defaultImage gamesImage teamColorLayer 
                        default ${game.homeTeam.abbrev} gradient`} alt={""}/>
                        <img className={`defaultImage gamesImage default ${game.homeTeam.abbrev} layerImage`}
                             src={coachIndicator}
                             alt={game.summary.gameInfo.homeTeam.headCoach
                                  ? `${game.summary.gameInfo.homeTeam.headCoach.default} headshot`
                                  : `${game.homeTeam.abbrev} head coach headshot`}/>
                    </div>
                    <div className={"verticalFlex"}>
                        {
                            game.summary.gameInfo.homeTeam.headCoach
                            ? <span className={"primary"}>{game.summary.gameInfo.homeTeam.headCoach.default}</span>
                            : null
                        }
                        <span className={"secondary"}>Head coach</span>
                        <div className={"horizontalFlex stats"}>
                            <span>{game.homeTeam.abbrev}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </details>;
}

export default Staff;
