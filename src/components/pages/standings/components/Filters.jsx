import {useCallback, useEffect, useMemo, useRef} from "react";
import {compareTextual} from "../../../../scripts/utils.js";

function Filters({fullStandings, setConferences, setDivisions}) {
    const conferenceSelect = useRef(null);
    const divisionSelect = useRef(null);

    const selectedConferences = useMemo(() => {
        let uniqueConfs = [];
        if (fullStandings) {
            for (let item of fullStandings) {
                let isUniqueConf = uniqueConfs.some(conference => conference === item.conferenceName);
                if (!isUniqueConf && item.conferenceName) {
                    uniqueConfs.push(item.conferenceName);
                }
            }
            uniqueConfs.sort(compareTextual);
        }
        return uniqueConfs;
    }, [fullStandings]);

    const selectedDivisions = useMemo(() => {
        let uniqueDivs = [];
        if (fullStandings) {
            for (let item of fullStandings) {
                let isUniqueDiv = uniqueDivs.some(division => division === item.divisionName);
                if (!isUniqueDiv && item.divisionName) {
                    uniqueDivs.push(item.divisionName);
                }
            }
            uniqueDivs.sort(compareTextual);
        }
        return uniqueDivs;
    }, [fullStandings]);

    function removeOtherSelections(event) {
        let select = event.target;
        if (select === conferenceSelect.current) {
            divisionSelect.current.selectedIndex = -1;
        } else if (select === divisionSelect.current) {
            conferenceSelect.current.selectedIndex = -1;
        }
    }

    function applyFilters() {
        let conferences = Array.from(conferenceSelect.current.selectedOptions).map(option => option.value);
        let divisions = Array.from(divisionSelect.current.selectedOptions).map(option => option.value);
        setConferences(conferences);
        setDivisions(divisions);
    }

    const resetFilters = useCallback(() => {
        conferenceSelect.current.selectedIndex = -1;
        divisionSelect.current.selectedIndex = -1;
        setConferences([]);
        setDivisions([]);
    }, [setConferences, setDivisions]);

    useEffect(() => {
        resetFilters();
    }, [fullStandings, resetFilters]);

    return <details>
        <summary>Filters</summary>
        <label className={"labelTitle"}>
            <span>Conference</span>
            <select ref={conferenceSelect}
                    multiple={true}
                    size={selectedConferences.length}
                    onChange={removeOtherSelections}>
                {
                    selectedConferences.map(conference =>
                        <option key={conference} title={conference} value={conference}>{conference}</option>
                    )
                }
            </select>
        </label>
        <label className={"labelTitle"}>
            <span>Division</span>
            <select ref={divisionSelect}
                    multiple={true}
                    size={selectedDivisions.length}
                    onChange={removeOtherSelections}>
                {
                    selectedDivisions.map(division =>
                        <option key={division} title={division} value={division}>{division}</option>
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
