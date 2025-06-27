import constants from "../data/constants.json";

export function isGameUpcoming(gameState) {
    return gameState === constants.gameState.pre || gameState === constants.gameState.upcoming;
}

export function isGameLive(gameState) {
    return gameState === constants.gameState.live || gameState === constants.gameState.crit;
}

export function isGameFinished(gameState) {
    return gameState === constants.gameState.off || gameState === constants.gameState.final;
}

export async function getPlayerKeyboard(event, playerID, setPlayer, setFetchState, setActiveView, setPreviousView) {
    if (event.key === "Enter" || event.key === " ") {
        await getPlayer(playerID, setPlayer, setFetchState, setActiveView, setPreviousView);
    }
}

export function getVideoURL(key) {
    return `https://players.brightcove.net/6415718365001/EXtG1xJ7H_default/index.html?videoId=${key}`;
}

export function getVisualizerURL(gameID, eventID) {
    return `https://www.nhl.com/ppt-replay/goal/${gameID}/${eventID}`;
}

export async function getPlayer(playerID, setPlayer, setFetchState, setActiveView, setPreviousView) {
    if (playerID) {
        setFetchState(constants.fetchState.loading);
        if (setPreviousView) {
            setPreviousView(constants.dialogViews.game);
        }
        if (setActiveView) {
            setActiveView(constants.dialogViews.player);
        }
        try {
            let response = await fetch(`${constants.baseURL}/players/getPlayer/${playerID}`);
            if (response.ok) {
                setPlayer(await response.json());
                setFetchState(constants.fetchState.finished);
            } else {
                setFetchState(constants.fetchState.error);
            }
        } catch (ignored) {
            setFetchState(constants.fetchState.error);
        }
    }
}

export async function getGame(gameID, setGame, setFetchState, setActiveView) {
    if (gameID) {
        setFetchState(constants.fetchState.loading);
        setActiveView(constants.dialogViews.game);
        try {
            let response = await fetch(`${constants.baseURL}/schedule/getGame/${gameID}`);
            if (response.ok) {
                setGame(await response.json());
                setFetchState(constants.fetchState.finished);
            } else {
                setFetchState(constants.fetchState.error);
            }
        } catch (ignored) {
            setFetchState(constants.fetchState.error);
        }
    }
}

export function compareNumeric(a, b) {
    if (typeof a === "number" && typeof b === "number") {
        return a - b;
    }
    if (typeof a === "number" && typeof b !== "number") {
        return -1;
    }
    if (typeof a !== "number" && typeof b === "number") {
        return 1;
    }
    return 0;
}

export function compareTextual(a, b) {
    if (typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b);
    }
    if (typeof a === "string" && typeof b !== "string") {
        return -1;
    }
    if (typeof a !== "string" && typeof b === "string") {
        return 1;
    }
    return 0;
}

export function sortObjects(objects, path, numericCompare = false, secondaryComparisonFunction = undefined) {
    let primaryComparisonFunction = numericCompare ? compareNumeric : compareTextual;
    objects.sort((a, b) => {
        let difference = primaryComparisonFunction(getValue(path, a), getValue(path, b));
        if (difference === 0 && secondaryComparisonFunction) {
            return secondaryComparisonFunction(a, b);
        }
        return difference;
    });
}

export function getValue(path, object, interpretAsMultipleKeys = false, fallback = undefined) {
    if (Array.isArray(path)) {
        if (interpretAsMultipleKeys) {
            let values = [];
            for (let key of path) {
                let value = object[key];
                values.push(value === undefined ? fallback : value);
            }
            return values;
        }
        return path.reduce((key, value) => {
            if (key !== undefined && key[value] !== undefined) {
                return key[value];
            }
            return fallback;
        }, object);
    }
    return fallback;
}

export function splitArrayByKey(array, key) {
    let slicedArray = [];
    let index = 0;
    for (let i = 1; i < array.length; i++) {
        if (array[i][key] !== array[i - 1][key]) {
            slicedArray.push(array.slice(index, i));
            index = i;
        }
    }
    slicedArray.push(array.slice(index, array.length));
    return slicedArray;
}

export function getTeamLogo(teams, teamAbbrev) {
    if (teams && teams.length > 0) {
        for (let team of teams) {
            if (team?.teamAbbrev?.default === teamAbbrev) {
                return team?.teamLogo;
            }
        }
    }
    return null;
}

export function getTeamName(teams, teamAbbrev) {
    if (teams && teams.length > 0) {
        for (let team of teams) {
            if (team?.teamAbbrev?.default === teamAbbrev) {
                return team?.teamName.default;
            }
        }
    }
    return null;
}
