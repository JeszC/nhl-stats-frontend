import {getGameType} from "./parsing.js";

const separator = "\r\n";

export function getICSFile(games, useAlarm, alarmTime) {
    let creationTime = formatDate(new Date().toUTCString());
    let file = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//NHL Stats//NHL Team Schedules//EN",
        "CALSCALE:GREGORIAN"
    ].join(separator).concat(separator);
    for (let game of games) {
        let uid = game.id.toString();
        let startTime;
        let status;
        if (game.gameScheduleState === "TBD") {
            startTime = game.gameDate.split("-").join("");
            status = "TENTATIVE";
        } else {
            startTime = formatDate(game.startTimeUTC);
            status = "CONFIRMED";
        }
        let summary = `NHL: ${game.awayTeam.abbrev}-${game.homeTeam.abbrev} (${getGameType(game)})`;
        let location = `${game.venue.default}, ${game.homeTeam.placeName.default}`;
        let description = `NHL game between ${getTeamName(game.awayTeam)} and ${getTeamName(game.homeTeam)}`;
        let event = createEvent(uid, creationTime, startTime, status, summary,
            description, location, useAlarm, alarmTime);
        file = file.concat(event);
    }
    file = file.concat("END:VCALENDAR");
    return file;
}

function createEvent(uid, creationTime, startTime, status, summary, description, location, useAlarm, alarmTime) {
    let fields = [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${creationTime}`,
        `DTSTART:${startTime}`,
        `STATUS:${status}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`
    ].join(separator).concat(separator);
    if (useAlarm) {
        let alarmFields = [
            "BEGIN:VALARM",
            `TRIGGER:-PT${alarmTime}M`,
            "ACTION:DISPLAY",
            `DESCRIPTION:${description}`,
            "END:VALARM"
        ].join(separator).concat(separator);
        fields = fields.concat(alarmFields);
    }
    fields = fields.concat("END:VEVENT").concat(separator);
    return fields;
}

function getTeamName(team) {
    return `${team.placeName.default} ${team.commonName.default}`;
}

function formatDate(dateString) {
    let date = new Date(dateString);
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    let year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year + month + day}T${hours}${minutes}${seconds}Z`;
}
