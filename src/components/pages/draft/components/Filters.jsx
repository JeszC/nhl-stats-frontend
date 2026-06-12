import {useCallback, useEffect, useMemo, useRef} from "react";
import {compareTextual} from "../../../../scripts/utils.js";

function Filters({draft, setSelectedPositions, setSelectedCountries, setSelectedDraftTeams}) {
    const positionSelect = useRef(null);
    const countrySelect = useRef(null);
    const draftTeamSelect = useRef(null);

    const positions = useMemo(() => {
        let uniquePositions = [];
        for (let player of draft) {
            let isUniquePosition = uniquePositions.some(position => position === player.position);
            if (!isUniquePosition && player.position) {
                uniquePositions.push(player.position);
            }
        }
        uniquePositions.sort(compareTextual);
        return uniquePositions;
    }, [draft]);

    const countries = useMemo(() => {
        let uniqueCountries = [];
        for (let player of draft) {
            let isUniqueCountry = uniqueCountries.some(country => country === player.countryCode);
            if (!isUniqueCountry && player.countryCode) {
                uniqueCountries.push(player.countryCode);
            }
        }
        uniqueCountries.sort(compareTextual);
        return uniqueCountries;
    }, [draft]);

    const draftTeams = useMemo(() => {
        let uniqueDraftTeams = [];
        for (let player of draft) {
            let isUniqueDraftTeam = uniqueDraftTeams.some(draftTeam => draftTeam === player.triCode);
            if (!isUniqueDraftTeam && player.triCode) {
                uniqueDraftTeams.push(player.triCode);
            }
        }
        uniqueDraftTeams.sort(compareTextual);
        return uniqueDraftTeams;
    }, [draft]);

    function applyFilters() {
        let positions = Array.from(positionSelect.current.selectedOptions).map(option => option.value);
        let countries = Array.from(countrySelect.current.selectedOptions).map(option => option.value);
        let draftTeams = Array.from(draftTeamSelect.current.selectedOptions).map(option => option.value);
        setSelectedPositions(positions);
        setSelectedCountries(countries);
        setSelectedDraftTeams(draftTeams);
    }

    const resetFilters = useCallback(() => {
        positionSelect.current.selectedIndex = -1;
        countrySelect.current.selectedIndex = -1;
        draftTeamSelect.current.selectedIndex = -1;
        setSelectedPositions([]);
        setSelectedCountries([]);
        setSelectedDraftTeams([]);
    }, [setSelectedPositions, setSelectedCountries, setSelectedDraftTeams]);

    useEffect(() => {
        resetFilters();
    }, [draft, resetFilters]);

    return <details>
        <summary>Filters</summary>
        <label className={"labelTitle"}>
            <span>Position</span>
            <select ref={positionSelect} multiple={true} size={5}>
                {
                    positions.map(position =>
                        <option key={position} title={position} value={position}>{position}</option>
                    )
                }
            </select>
        </label>
        <label className={"labelTitle"}>
            <span>Country</span>
            <select ref={countrySelect} multiple={true} size={4}>
                {
                    countries.map(country =>
                        <option key={country} title={country} value={country}>{country}</option>
                    )
                }
            </select>
        </label>
        <label className={"labelTitle"}>
            <span>Draft team</span>
            <select ref={draftTeamSelect} multiple={true} size={4}>
                {
                    draftTeams.map(draftTeam =>
                        <option key={draftTeam} title={draftTeam} value={draftTeam}>{draftTeam}</option>
                    )
                }
            </select>
        </label>
        <div className={"horizontalFlex adjacentButtons"}>
            <button type={"button"} title={"Apply"} onClick={applyFilters}>Apply</button>
            <button type={"button"} title={"Reset"} onClick={resetFilters}>Reset</button>
        </div>
    </details>;
}

export default Filters;
