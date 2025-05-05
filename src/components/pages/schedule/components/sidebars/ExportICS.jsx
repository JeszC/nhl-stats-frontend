import {useEffect, useRef, useState} from "react";
import constants from "../../../../../data/constants.json";
import {getICSFile} from "../../../../../scripts/exportICS.js";

function ExportICS({games, selectedSeason, selectedTeams, fetchState}) {
    const [gamesToImport, setGamesToImport] = useState([]);
    const [upcomingChecked, setUpcomingChecked] = useState(true);
    const [useAlarmChecked, setUseAlarmChecked] = useState(false);
    const upcomingGamesOnly = useRef(null);
    const useAlarm = useRef(null);
    const alarmTime = useRef(null);
    const downloadLink = useRef(null);

    async function createICSFile() {
        if (selectedTeams.length > 0) {
            downloadLink.current.click();
        }
    }

    function filterUpcomingGames(games) {
        return games.filter(game => new Date(game.startTimeUTC) > new Date());
    }

    function updateICSFile() {
        if (selectedTeams.length > 0) {
            let gamesToImport = upcomingChecked ? filterUpcomingGames(games) : games;
            setGamesToImport(gamesToImport);
        }
    }

    useEffect(updateICSFile, [selectedTeams, games, upcomingChecked]);

    return <>
        <h4>Export to ICS</h4>
        <label className={"checkboxLabel"}>
            <input ref={upcomingGamesOnly}
                   type={"checkbox"}
                   name={"upcomingGamesOnly"}
                   className={selectedTeams.length === 1 ? selectedTeams[0].teamAbbrev : "default"}
                   checked={upcomingChecked}
                   onChange={() => setUpcomingChecked(!upcomingChecked)}/>
            Exclude past games
        </label>
        <label className={"checkboxLabel alarmCheckboxLabel"}>
            <input ref={useAlarm}
                   type={"checkbox"}
                   name={"useAlarm"}
                   className={selectedTeams.length === 1 ? selectedTeams[0].teamAbbrev : "default"}
                   onChange={() => setUseAlarmChecked(!useAlarmChecked)}/>
            Include alarms
        </label>
        <label className={"verticalFlex"}>
            <span>Minutes before game start to trigger alarm</span>
            <input ref={alarmTime}
                   type={"range"}
                   name={"alarmTime"}
                   className={selectedTeams.length === 1 ? selectedTeams[0].teamAbbrev : "default"}
                   disabled={!useAlarmChecked}
                   min={0}
                   max={60}
                   step={5}
                   list={"tickmarks"}/>
            <datalist id="tickmarks">
                <option value="0" label={"0"}></option>
                <option value="15" label={"15"}></option>
                <option value="30" label={"30"}></option>
                <option value="45" label={"45"}></option>
                <option value="60" label={"60"}></option>
            </datalist>
        </label>
        <button type={"button"}
                title={"Export"}
                onClick={createICSFile}
                disabled={
                    gamesToImport.length === 0
                    || selectedTeams.length === 0
                    || fetchState === constants.fetchState.loading
                }>
            Export
        </button>
        {
            selectedTeams.length === 0
            ? <span className={"warningICS"}>Select at least one team to export ICS file</span>
            : null
        }
        {
            fetchState !== constants.fetchState.loading && selectedTeams.length > 0 && gamesToImport.length === 0
            ? <span className={"warningICS"}>No upcoming games so nothing to export</span>
            : null
        }
        {
            fetchState === constants.fetchState.loading
            ? <span className={"warningICS"}>Loading schedule...</span>
            : null
        }
        <a ref={downloadLink}
           href={window.URL.createObjectURL(new Blob(
               [getICSFile(gamesToImport, useAlarmChecked, alarmTime.current?.value)],
               {type: "text/calendar"}))}
           download={`nhl-schedule-${selectedSeason}`}
           title={"Download link for schedule"}
           className={"hidden"}>
            Download ICS file
        </a>
    </>;
}

export default ExportICS;
