import {useCallback, useEffect, useRef, useState} from "react";
import {compareTextual} from "../../../../scripts/utils.js";

function Filters({fullStandings, setConferences, setDivisions}) {
    const [selectedConferences, setSelectedConferences] = useState([]);
    const [selectedDivisions, setSelectedDivisions] = useState([]);
    const conferenceSelect = useRef(null);
    const divisionSelect = useRef(null);

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
    }, [conferenceSelect, divisionSelect, setConferences, setDivisions]);

    const getConferencesAndDivisions = useCallback(() => {
        let uniqueConfs = [];
        let uniqueDivs = [];
        for (let item of fullStandings) {
            let isUniqueConf = uniqueConfs.some(conference => conference === item.conferenceName);
            let isUniqueDiv = uniqueDivs.some(division => division === item.divisionName);
            if (!isUniqueConf && item.conferenceName) {
                uniqueConfs.push(item.conferenceName);
            }
            if (!isUniqueDiv && item.divisionName) {
                uniqueDivs.push(item.divisionName);
            }
        }
        uniqueConfs.sort(compareTextual);
        uniqueDivs.sort(compareTextual);
        setSelectedConferences(uniqueConfs);
        setSelectedDivisions(uniqueDivs);
    }, [fullStandings]);

    useEffect(() => {
        resetFilters();
        getConferencesAndDivisions();
    }, [resetFilters, getConferencesAndDivisions]);

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
