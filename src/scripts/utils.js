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
            setPreviousView("game");
        }
        if (setActiveView) {
            setActiveView("player");
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
        setActiveView("game");
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
    if (typeof a === "string" || typeof b === "string") {
        return compareTextual(a, b);
    }
    if (a === null || typeof a === "undefined") {
        if (b === null || typeof b === "undefined") {
            return 0;
        }
        return -b;
    }
    if (b === null || typeof b === "undefined") {
        return a;
    }
    return a - b;
}

export function compareTextual(a, b) {
    if (a === null || typeof a === "undefined") {
        if (b === null || typeof b === "undefined") {
            return 0;
        }
        return -"".localeCompare(b);
    }
    if (b === null || typeof b === "undefined") {
        return "".localeCompare(a);
    }
    return a.localeCompare(b);
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
