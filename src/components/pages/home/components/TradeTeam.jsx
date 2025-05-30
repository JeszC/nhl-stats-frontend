function TradeTeam({team, teamLogo, teamAbbrev}) {

    return <>
        <div className={"horizontalFlex tradeTeam"}>
            <img className={`tradeTeamLogo default ${team.team.team_shortname} gradient`}
                 src={teamLogo}
                 alt={`${teamAbbrev} logo`}/>
            <div className={"verticalFlex tradeItems"}>
                <span className={"tradeTeamName"}>{team.team.name} acquire</span>
                <ul className={"tradeItemList"}>
                    {
                        team.acquires.map((acquisition, index) =>
                            <li key={(acquisition.name ? acquisition.name : acquisition) + index.toString()}>
                                {acquisition.name ? acquisition.name : acquisition}
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    </>;
}

export default TradeTeam;
