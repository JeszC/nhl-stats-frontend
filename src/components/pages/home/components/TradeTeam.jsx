function TradeTeam({team}) {

    return <>
        <div className={"horizontalFlex tradeTeam"}>
            <img className={`tradeTeamLogo default ${team.team.team_shortname} gradient`}
                 src={team.team.team_image_url}
                 alt={"Team logo"}/>
            <div className={"verticalFlex tradeItems"}>
                <span className={"tradeTeamName"}>{team.team.name} acquire</span>
                <ul className={"tradeItemList"}>
                    {
                        team.acquires.map(acquisition =>
                            <li>{acquisition.name ? acquisition.name : acquisition}</li>
                        )
                    }
                </ul>
            </div>
        </div>
    </>;
}

export default TradeTeam;
