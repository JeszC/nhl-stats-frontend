import {useEffect, useRef, useState} from "react";
import constants from "../../../../data/constants.json";

function TeamSelect({season, localStorageKey, setSelectedTeams, fetchState, setFetchState, fetchTrigger}) {
    const [teams, setTeams] = useState([]);
    const teamSelect = useRef(null);

    function selectAll() {
        for (let option of teamSelect.current.options) {
            option.selected = true;
        }
        applySelection();
    }

    function applySelection() {
        let selectedTeams = Array.from(teamSelect.current.selectedOptions).map(option => ({
            teamName: option.label,
            teamAbbrev: option.value
        }));
        setSelectedTeams(selectedTeams);
        if (selectedTeams.length > 0 && localStorageKey) {
            localStorage.setItem(localStorageKey, JSON.stringify(selectedTeams));
        } else {
            localStorage.removeItem(localStorageKey);
        }
    }

    function resetSelection() {
        teamSelect.current.selectedIndex = -1;
        setSelectedTeams([]);
        localStorage.removeItem(localStorageKey);
    }

    async function getTeams(season) {
        let response = await fetch(`${constants.baseURL}/teams/getTeams/${season}`);
        if (response.ok) {
            return await response.json();
        }
        throw new Error("HTTP error when fetching teams.");
    }

    function selectOptions() {
        let savedTeams = JSON.parse(localStorage.getItem(localStorageKey));
        if (savedTeams) {
            let options = Array.from(teamSelect.current);
            options.filter(option => savedTeams.some(team => team.teamAbbrev === option.value))
                   .forEach(option => {
                       option.selected = true;
                   });
        }
    }

    function fetchTeamsForSeason() {
        if (season) {
            setTeams([]);
            getTeams(season)
                .then(result => setTeams(result))
                .catch(() => setFetchState(constants.fetchState.error));
        }
    }

    function setUpOnLoad() {
        let savedTeams = JSON.parse(localStorage.getItem(localStorageKey)) ?? [];
        setSelectedTeams(savedTeams);
    }

    useEffect(selectOptions, [localStorageKey, teams]);

    useEffect(fetchTeamsForSeason, [fetchTrigger, season, setFetchState]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <>
        <label className={"labelTitle"}>
            <span>Team selection</span>
            <select ref={teamSelect} name={"team-select"} multiple={true} size={8}>
                {
                    teams.map(team =>
                        <option key={team.name} title={team.name} value={team.abbrev}>{team.name}</option>
                    )
                }
            </select>
        </label>
        <div className={"horizontalFlex adjacentButtons"}>
            <button type={"button"}
                    title={"Select all"}
                    onClick={selectAll}
                    disabled={fetchState === constants.fetchState.loading}>
                All
            </button>
            <button type={"button"}
                    title={"Apply"}
                    onClick={applySelection}
                    disabled={fetchState === constants.fetchState.loading}>
                Apply
            </button>
            <button type={"button"}
                    title={"Reset"}
                    onClick={resetSelection}
                    disabled={fetchState === constants.fetchState.loading}>
                Reset
            </button>
        </div>
    </>;
}

export default TeamSelect;
