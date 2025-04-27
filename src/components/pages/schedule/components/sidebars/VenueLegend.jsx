function VenueLegend({selectedTeams}) {

    function getHomeColor() {
        return selectedTeams.length === 1 ? `venueBackground ${selectedTeams[0].teamAbbrev}` : "venueBackground";
    }

    return selectedTeams.length === 1
           ? <>
               <h4>Game location</h4>
               <div className={"horizontalFlex"}>
                   <span className={"venueBackground default"}>Away</span>
                   <span className={getHomeColor()}>Home</span>
               </div>
           </>
           : null;
}

export default VenueLegend;
