import officialIndicator from "../../../../../images/Official.svg";

function Officials({game}) {

    return <details className={"gamesContent"} open>
        <summary className={"gamesTitle"}>Officials</summary>
        <div className={"periodInformation"}>
            {
                game.summary.gameInfo.referees.map((referee, index) =>
                    <div key={referee.default + index.toString()} className={"horizontalFlex playerInformation"}>
                        {
                            referee.headshot
                            ? <img className={"defaultImage gamesImage default gradient"}
                                   src={referee.headshot}
                                   alt={`${referee.default} headshot`}/>
                            : <img className={"defaultImage gamesImage default gradient"}
                                   src={officialIndicator}
                                   alt={"Referee headshot"}/>
                        }
                        <div className={"verticalFlex"}>
                            <span className={"primary"}>{referee.default}</span>
                            <span className={"secondary"}>Referee</span>
                            <div className={"horizontalFlex stats scratchStats playersCountryOfBirth"}>
                                {
                                    referee.nationalityCode
                                    ? <img src={referee.countryFlag}
                                           alt={`${referee.nationalityCode} flag`}
                                           title={referee.nationalityCode}/>
                                    : null
                                }
                                {
                                    referee.sweaterNumber
                                    ? <span className={"scratchSingleStat"}>
                                        #{referee.sweaterNumber.toLocaleString()}
                                    </span>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            {
                game.summary.gameInfo.linesmen.map((linesman, index) =>
                    <div key={linesman.default + index.toString()} className={"horizontalFlex playerInformation"}>
                        {
                            linesman.headshot
                            ? <img className={"defaultImage gamesImage default gradient"}
                                   src={linesman.headshot}
                                   alt={`${linesman.default} headshot`}/>
                            : <img className={"defaultImage gamesImage default gradient"}
                                   src={officialIndicator}
                                   alt={"Linesman headshot"}/>
                        }
                        <div className={"verticalFlex"}>
                            <span className={"primary"}>{linesman.default}</span>
                            <span className={"secondary"}>Linesman</span>
                            <div className={"horizontalFlex stats scratchStats playersCountryOfBirth"}>
                                {
                                    linesman.nationalityCode
                                    ? <img src={linesman.countryFlag}
                                           alt={`${linesman.nationalityCode} flag`}
                                           title={linesman.nationalityCode}/>
                                    : null
                                }
                                {
                                    linesman.sweaterNumber
                                    ? <span className={"scratchSingleStat"}>
                                        #{linesman.sweaterNumber.toLocaleString()}
                                    </span>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    </details>;
}

export default Officials;
