function TeamTitleColumn({columnTitle, teamAbbreviation}) {

    return <>
        <div className={"verticalFlex statisticsColumn"}>
            <span className={`statisticsHeader ${teamAbbreviation} border`}>{columnTitle}</span>
            <span>Games played</span>
            <span>Wins</span>
            <span>Losses</span>
            <span>Ties</span>
            <span>Overtime losses</span>
            <span>Point percentage</span>
            <span>Goals for</span>
            <span>Goals against</span>
            <span>Shutouts</span>
            <span>Penalty minutes</span>
        </div>
    </>;
}

export default TeamTitleColumn;
