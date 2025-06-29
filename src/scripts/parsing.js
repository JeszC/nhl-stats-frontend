import constants from "../data/constants.json";

const defaultDigits = 2;
const defaultDecimals = 2;
const defaultMissingValue = "N/A";
const defaultRecordSeparator = constants.apiRecordSeparator;
const defaultTimeSeparator = constants.apiTimeSeparator;
const pluralRulesEnglish = new Intl.PluralRules("en-US", {type: "ordinal"});
const suffixesEnglish = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"]
]);

export function capitalize(string) {
    return string && string.length > 0 ? string.charAt(0).toUpperCase() + string.slice(1) : "";
}

export function getOrdinalNumber(number) {
    let rule = pluralRulesEnglish.select(number);
    let suffix = suffixesEnglish.get(rule);
    return `${number}${suffix}`;
}

export function getPlayerName(player) {
    return player && player.name ? player.name.default : "";
}

export function getPlayerFullName(player) {
    let firstName = getPlayerFirstName(player);
    let lastName = getPlayerLastName(player);
    return `${firstName} ${lastName}`;
}

export function getPlayerFirstName(player) {
    return player && player.firstName ? player.firstName.default : "";
}

export function getPlayerLastName(player) {
    return player && player.lastName ? player.lastName.default : "";
}

export function getSeasonWithSeparator(season) {
    return `${season.slice(0, 4)}-${season.slice(4)}`;
}

export function getGameType(game) {
    let gameTypes = constants.gameType;
    for (let gameType in gameTypes) {
        if (Object.prototype.hasOwnProperty.call(gameTypes, gameType)) {
            let currentGameType = gameTypes[gameType];
            if (currentGameType.index === game.gameType) {
                if (game.gameType === gameTypes.playoff.index && game.seriesStatus) {
                    let name = currentGameType.name;
                    let roundNumber = game.seriesStatus.round.toLocaleString();
                    let gameNumber = game.seriesStatus.gameNumberOfSeries.toLocaleString();
                    return `${name}: round ${roundNumber}, game ${gameNumber}`;
                }
                return currentGameType.name;
            }
        }
    }
    return "";
}

export function getPeriodTitle(gameType, number, otIndex) {
    if (number < 4) {
        return `${getOrdinalNumber(number)} period`;
    }
    switch (number) {
        case 4:
            if (gameType === constants.gameType.playoff.index) {
                return otIndex ? `Overtime ${otIndex.toLocaleString()}` : "Overtime 1";
            }
            return "Overtime";
        case 5:
            if (gameType === constants.gameType.playoff.index && otIndex !== undefined) {
                return `Overtime ${otIndex.toLocaleString()}`;
            }
            return "Shootout";
        default:
            if (gameType === constants.gameType.playoff.index && otIndex !== undefined) {
                return `Overtime ${otIndex.toLocaleString()}`;
            }
            return `${getOrdinalNumber(number)} period`;
    }
}

export function getPositionTitle(positionCode) {
    switch (positionCode) {
        case "C":
            return "Center";
        case "L":
            return "Left Winger";
        case "R":
            return "Right Winger";
        case "D":
            return "Defender";
        case "G":
            return "Goaltender";
        default:
            return positionCode;
    }
}

export function getHandSideTitle(shootsCatchesCode) {
    switch (shootsCatchesCode) {
        case "L":
            return "Left";
        case "R":
            return "Right";
        default:
            return shootsCatchesCode;
    }
}

export function parseDecimals(percentage, multiplier = 100, decimals = defaultDecimals) {
    let value = percentage * multiplier;
    return value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

export function parseSeason(season) {
    return `${season.toString().slice(0, 4)}-${season.toString().slice(4)}`;
}

export function formatAndParseRecord(values) {
    let recordString = values.join(constants.apiRecordSeparator);
    return parseRecord(recordString);
}

export function parseRecord(record, separator = defaultRecordSeparator) {
    let recordParts = record.split(constants.apiRecordSeparator);
    let result = "";
    for (let i = 0; i < recordParts.length; i++) {
        result += parseInt(recordParts[i]).toLocaleString();
        if (i !== recordParts.length - 1) {
            result += separator;
        }
    }
    return result;
}

export function parsePeriodTime(gameType, period, time, digits = defaultDigits, separator = defaultTimeSeparator) {
    if (time !== undefined) {
        if (gameType === constants.gameType.playoff.index || period < 5) {
            let parts = time.split(constants.apiTimeSeparator);
            let periodMinutes = 20 * (period - 1);
            let minutesSoFar = periodMinutes + parseInt(parts[0]);
            let minutes = minutesSoFar.toLocaleString(undefined, {minimumIntegerDigits: digits});
            let seconds = parseInt(parts[1]).toLocaleString(undefined, {minimumIntegerDigits: digits});
            return `${minutes}${separator}${seconds}`;
        }
        return parseTime(time, digits, separator);
    }
    return defaultMissingValue;
}

export function parseTime(time, digits = defaultDigits, separator = defaultTimeSeparator) {
    let parts = time.split(constants.apiTimeSeparator);
    let minutes = parseInt(parts[0]).toLocaleString(undefined, {minimumIntegerDigits: digits});
    let seconds = parseInt(parts[1]).toLocaleString(undefined, {minimumIntegerDigits: digits});
    return `${minutes}${separator}${seconds}`;
}

export function parseIceTimeFromTotalTime(iceTime, digits = defaultDigits, separator = defaultTimeSeparator) {
    if (iceTime !== undefined) {
        let iceTimeRounded = Math.round(parseInt(iceTime));
        let minutes = Math.floor(iceTimeRounded / 60);
        let seconds = iceTimeRounded - minutes * 60;
        let iceTimeAsString = `${minutes}${separator}${seconds}`;
        return parseIceTime(iceTimeAsString, digits, separator);
    }
    return defaultMissingValue;
}

export function parseIceTime(iceTime, digits = defaultDigits, separator = defaultTimeSeparator) {
    if (iceTime !== undefined) {
        let iceTimeParts = iceTime.split(constants.apiTimeSeparator);
        let minutes = parseInt(iceTimeParts[0]).toLocaleString(undefined, {minimumIntegerDigits: digits});
        let seconds = parseInt(iceTimeParts[1]).toLocaleString(undefined, {minimumIntegerDigits: digits});
        return `${minutes}${separator}${seconds}`;
    }
    return defaultMissingValue;
}

export function parseGoalieIceTime(iceTime, gamesPlayed, digits = defaultDigits, separator = defaultTimeSeparator) {
    if (iceTime !== undefined) {
        let iceTimeParts = iceTime.split(constants.apiTimeSeparator);
        let seconds = parseInt(iceTimeParts[0]) * 60 + parseInt(iceTimeParts[1]);
        let secondsPerGame = Math.floor(seconds / gamesPlayed);
        let minutes = Math.floor(secondsPerGame / 60);
        let leftoverSeconds = secondsPerGame - minutes * 60;
        let finalMinutes = minutes.toLocaleString(undefined, {minimumIntegerDigits: digits});
        let finalSeconds = leftoverSeconds.toLocaleString(undefined, {minimumIntegerDigits: digits});
        return `${finalMinutes}${separator}${finalSeconds}`;
    }
    return defaultMissingValue;
}

export function fixAbbreviation(teamAbbreviation) {
    let capitalizedAbbreviation = teamAbbreviation.toUpperCase();
    switch (capitalizedAbbreviation) {
        case "CLB":
            return "CBJ";
        case "LA":
            return "LAK";
        case "NJ":
            return "NJD";
        case "SJ":
            return "SJS";
        case "TB":
            return "TBL";
        default:
            return capitalizedAbbreviation;
    }
}

export function parseTeamAbbreviation(teamName) {
    switch (teamName.trim().toLowerCase()) {
        case "anaheim ducks":
            return "ANA";
        case "arizona coyotes":
            return "ARI";
        case "atlanta flames":
            return "AFM";
        case "atlanta thrashers":
            return "ATL";
        case "boston bruins":
            return "BOS";
        case "buffalo sabres":
            return "BUF";
        case "calgary flames":
            return "CGY";
        case "california golden seals":
            return "CGS";
        case "carolina hurricanes":
            return "CAR";
        case "chicago blackhawks":
            return "CHI";
        case "cleveland barons":
            return "CLE";
        case "colorado avalanche":
            return "COL";
        case "colorado rockies":
            return "CLR";
        case "columbus blue jackets":
            return "CBJ";
        case "dallas stars":
            return "DAL";
        case "detroit red wings":
            return "DET";
        case "edmonton oilers":
            return "EDM";
        case "florida panthers":
            return "FLA";
        case "hartford whalers":
            return "HFD";
        case "kansas city scouts":
            return "KCS";
        case "los angeles kings":
            return "LAK";
        case "minnesota wild":
            return "MIN";
        case "minnesota north stars":
            return "MNS";
        case "montréal canadiens":
            return "MTL";
        case "nashville predators":
            return "NSH";
        case "new jersey devils":
            return "NJD";
        case "new york islanders":
            return "NYI";
        case "new york rangers":
            return "NYR";
        case "oakland seals":
            return "OAK";
        case "ottawa senators":
            return "OTT";
        case "philadelphia flyers":
            return "PHI";
        case "phoenix coyotes":
            return "PHX";
        case "pittsburgh penguins":
            return "PIT";
        case "quebec nordiques":
            return "QUE";
        case "san jose sharks":
            return "SJS";
        case "seattle kraken":
            return "SEA";
        case "st. louis blues":
            return "STL";
        case "tampa bay lightning":
            return "TBL";
        case "toronto maple leafs":
            return "TOR";
        case "utah hockey club":
            return "UTA";
        case "vancouver canucks":
            return "VAN";
        case "vegas golden knights":
            return "VGK";
        case "washington capitals":
            return "WSH";
        case "winnipeg jets":
            return "WPG";
        case "winnipeg jets (1979)":
            return "WIN";
        default:
            return "";
    }
}
