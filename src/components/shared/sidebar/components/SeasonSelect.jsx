import {useCallback, useEffect, useRef, useState} from "react";
import constants from "../../../../data/constants.json";
import {getResponseData} from "../../../../scripts/utils.js";

function SeasonSelect({localStorageKey, setSelectedSeasons, fetchState, setFetchState, setFetchTrigger}) {
    const [seasons, setSeasons] = useState([]);
    const seasonSelect = useRef(null);
    const earliestSeason = 2000;

    const applySavedSeason = useCallback(() => {
        let season = localStorage.getItem(localStorageKey);
        if (season) {
            setSelectedSeasons(season);
            let options = Array.from(seasonSelect.current);
            options.forEach(option => {
                if (option.value === season) {
                    option.selected = true;
                }
            });
        } else {
            let options = Array.from(seasonSelect.current);
            if (options.length > 0) {
                let latestSeason = options[options.length - 1];
                latestSeason.selected = true;
                setSelectedSeasons(latestSeason.value);
            }
        }
    }, [localStorageKey, setSelectedSeasons]);

    function applySelection() {
        let selectedSeason = seasonSelect.current.value;
        setSelectedSeasons(selectedSeason);
        if (selectedSeason && localStorageKey) {
            localStorage.setItem(localStorageKey, selectedSeason);
        } else {
            localStorage.removeItem(localStorageKey);
        }
        setFetchTrigger(previousFetchTrigger => previousFetchTrigger + 1);
    }

    async function getLatestSeason() {
        let latestSeasonResponse = await fetch(`${constants.baseURL}/home/getLatestUpcomingSeason`);
        return await getResponseData(latestSeasonResponse, "Error fetching latest season.");
    }

    async function getSeasons() {
        let latestSeasonStartYear = 0;
        try {
            latestSeasonStartYear = parseInt((await getLatestSeason()).slice(0, 4));
        } catch (ignored) {
            setFetchState(constants.fetchState.error);
        }
        let seasons = [];
        for (let i = earliestSeason; i <= latestSeasonStartYear; i++) {
            seasons.push({
                title: `${i}-${i + 1}`,
                value: i.toString() + (i + 1).toString()
            });
        }
        return seasons;
    }

    function setUpOnLoad() {
        getSeasons().then(result => setSeasons(result));
    }

    useEffect(() => applySavedSeason(), [seasons, applySavedSeason]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <>
        <label className={"labelTitle"}>
            <span>Season selection</span>
            <select ref={seasonSelect} name={"season-select"} size={4}>
                {
                    seasons.map(season =>
                        <option key={season.value} title={season.title} value={season.value}>{season.title}</option>
                    )
                }
            </select>
        </label>
        <div className={"horizontalFlex adjacentButtons"}>
            <button type={"button"}
                    title={"Apply"}
                    onClick={applySelection}
                    disabled={fetchState === constants.fetchState.loading}>
                Apply
            </button>
        </div>
    </>;
}

export default SeasonSelect;
