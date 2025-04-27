function CareerAndSeasonTitleColumn({position, columnTitle, teamAbbreviation}) {
    return <>
        <div className={"verticalFlex statisticsColumn"}>
            <span className={`statisticsHeader ${teamAbbreviation} border`}>{columnTitle}</span>
            {
                position === "G"
                ? <>
                    <span>Games played</span>
                    <span>Wins</span>
                    <span>Losses</span>
                    <span>Save percentage</span>
                    <span>Goals against average</span>
                    <span>Shutouts</span>
                    <span>Penalty minutes</span>
                    <span>Goals</span>
                    <span>Assists</span>
                    <span>Average time on ice</span>
                </>
                : <>
                    <span>Games played</span>
                    <span>Points</span>
                    <span>Goals</span>
                    <span>Assists</span>
                    <span>Plus/minus</span>
                    <span>Penalty minutes</span>
                    <span>Shots</span>
                    <span>Shooting percentage</span>
                    <span>Face-off win percentage</span>
                    <span>Average time on ice</span>
                </>
            }
        </div>
    </>;
}

export default CareerAndSeasonTitleColumn;
