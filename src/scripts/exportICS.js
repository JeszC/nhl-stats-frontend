import {getGameType} from "./parsing.js";

const separator = "\r\n";

export function getICSFile(games) {
    let file = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//NHL STATS//NHL Team Schedules//EN"
    ].join(separator).concat(separator);
    for (let game of games) {
        let uid = game.id.toString();
        let startTime = formatDate(game.startTimeUTC);
        let summary = `NHL: ${game.awayTeam.abbrev}-${game.homeTeam.abbrev} (${getGameType(game)})`;
        let location = `${game.venue.default}, ${game.homeTeam.placeName.default}`;
        let description = `NHL game between ${game.awayTeam.abbrev} and ${game.homeTeam.abbrev}`;
        let event = createEvent(uid, startTime, summary, description, location);
        file = file.concat(event);
    }
    file = file.concat("END:VCALENDAR");
    return file;
}

function createEvent(uid, startTime, summary, description, location) {
    return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${startTime}`,
        `DTSTART:${startTime}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        "END:VEVENT"
    ].join(separator).concat(separator);
}

function formatDate(dateString) {
    let gameDay = new Date(dateString);
    gameDay.setTime(gameDay.getTime() + gameDay.getTimezoneOffset() * 60 * 1000);
    let year = gameDay.getFullYear().toString();
    let month = (gameDay.getMonth() + 1).toString().padStart(2, "0");
    let date = gameDay.getDate().toString().padStart(2, "0");
    let hours = gameDay.getHours().toString().padStart(2, "0");
    let minutes = gameDay.getMinutes().toString().padStart(2, "0");
    let seconds = gameDay.getSeconds().toString().padStart(2, "0");
    return `${year + month + date}T${hours}${minutes}${seconds}Z`;
}
