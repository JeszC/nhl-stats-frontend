import {useRef} from "react";
import {compareTextual} from "../../../../scripts/utils.js";
import PlayerSearch from "./PlayerSearch";

function Filters({players, selectedTeams, showGoalies, setPositions, setCountries, setSearchString}) {
    const positionSelect = useRef(null);
    const countrySelect = useRef(null);

    function getPositions() {
        if (selectedTeams.length > 0 && !showGoalies) {
            let uniquePositions = [];
            for (let player of players.skaters) {
                let isUniquePosition = uniquePositions.some(position => position === player.positionCode);
                if (!isUniquePosition && player.positionCode) {
                    uniquePositions.push(player.positionCode);
                }
            }
            uniquePositions.sort(compareTextual);
            return uniquePositions;
        }
        return [];
    }

    function getCountries() {
        if (selectedTeams.length > 0) {
            let goalieCountries = Array.from(new Set(players.goalies.map(goalie => goalie.birthCountry)));
            let skaterCountries = Array.from(new Set(players.skaters.map(skater => skater.birthCountry)));
            let countries = Array.from(new Set(goalieCountries.concat(skaterCountries)))
                                 .filter(country => country !== undefined && country !== null);
            countries.sort((a, b) => compareTextual(a, b));
            return countries;
        }
        return [];
    }

    function applyFilters() {
        let selectedOptionsPositions = Array.from(positionSelect.current.selectedOptions);
        setPositions(selectedOptionsPositions.map(option => option.value));
        let selectedOptionsCountries = Array.from(countrySelect.current.selectedOptions);
        setCountries(selectedOptionsCountries.map(option => option.value));
    }

    function resetFilters() {
        positionSelect.current.selectedIndex = -1;
        setPositions([]);
        countrySelect.current.selectedIndex = -1;
        setCountries([]);
    }

    return <details>
        <summary>Filters</summary>
        <PlayerSearch setSearchString={setSearchString}></PlayerSearch>
        <label className={showGoalies ? "labelTitle hidden" : "labelTitle"}>
            <span>Position</span>
            <select ref={positionSelect} multiple={true} size={4}>
                {
                    getPositions().map(position =>
                        <option key={position} title={position} value={position}>{position}</option>
                    )
                }
            </select>
        </label>
        <label className={"labelTitle"}>
            <span>Country</span>
            <select ref={countrySelect} multiple={true} size={4}>
                {
                    getCountries().map(country =>
                        <option key={country} title={country} value={country}>{country}</option>
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
