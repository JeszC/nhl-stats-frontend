function playoffTeam({series, seed, seedName, openDialog}) {

    function getSeedLetterAndNumber() {
        let team = series[`${seedName}Team`];
        let teamRank = series[`${seedName}Rank`];
        let teamRankAbbrev = series[`${seedName}RankAbbrev`];
        if (series.season === "20192020") {
            return team.conference + teamRank;
        }
        if (parseInt(series.season.slice(0, 4)) < 2013 && team.conference) {
            return team.conference.slice(2) + teamRank;
        }
        if (teamRankAbbrev?.slice(0, 2) === "WC") {
            return teamRankAbbrev;
        }
        if (team.division && teamRank) {
            return team.division + teamRank;
        }
        return "";
    }

    return seed !== undefined && seed !== null && Object.keys(seed).length > 0
           ? <button type={"button"}
                     className={`horizontalFlex playoffTeam default ${seed.abbrev} gradient`}
                     title={"Show team information"}
                     onClick={() => openDialog(seed.abbrev)}>
               <img src={seed.logo} alt={`${seed.abbrev} logo`}/>
               <div className={"verticalFlex playoffInformation"}>
                   <div className={"verticalFlex playoffTeamInformation"}>
                       <span className={"playoffTeamAbbreviation"}>{seed.abbrev}</span>
                       <span className={"playoffPosition"}>{getSeedLetterAndNumber()}</span>
                   </div>
                   <span className={"playoffScore"}>{series[`${seedName}Wins`].toLocaleString()}</span>
               </div>
           </button>
           : <button type={"button"} className={`horizontalFlex playoffTeam default`} title={"To be determined"}>
               <span className={"playoffTeamAbbreviation"}>TBD</span>
           </button>;
}

export default playoffTeam;
