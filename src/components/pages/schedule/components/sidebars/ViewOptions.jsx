function ViewOptions({
                         showTable, showScores, setShowScores,
                         filterUpcomingGames, setFilterUpcomingGames, selectedTeams
                     }) {

    return <>
        <h4>View options</h4>
        <label className={"checkboxLabel"}>
            <input type={"checkbox"}
                   name={"showScores"}
                   className={selectedTeams.length === 1 ? selectedTeams[0].teamAbbrev : "default"}
                   checked={showScores}
                   onChange={() => setShowScores(!showScores)}/>
            Show scores
        </label>
        {
            showTable
            ? <label className={"checkboxLabel"}>
                <input type={"checkbox"}
                       name={"filterUpcomingGames"}
                       className={selectedTeams.length === 1 ? selectedTeams[0].teamAbbrev : "default"}
                       checked={!filterUpcomingGames}
                       onChange={() => setFilterUpcomingGames(!filterUpcomingGames)}/>
                Show past games
            </label>
            : null
        }
    </>;
}

export default ViewOptions;
