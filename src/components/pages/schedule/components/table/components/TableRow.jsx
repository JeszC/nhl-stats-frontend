import constants from "../../../../../../data/constants.json";
import {getGameType, getOrdinalNumber} from "../../../../../../scripts/parsing.js";
import {getValue, isGameLive} from "../../../../../../scripts/utils.js";
import scheduleColumns from "./../../../../../../data/schedule.json";

function TableRow({game, index, selectedTeams, showScores, setSelectedGame, dialog, setFetchState}) {
    const formatterWeekday = new Intl.DateTimeFormat(undefined, {weekday: "long"});
    const formatterDate = new Intl.DateTimeFormat(undefined, {day: "2-digit", month: "2-digit", year: "numeric"});
    const formatterTime = new Intl.DateTimeFormat(undefined, {hour: "2-digit", minute: "2-digit"});

    function getHomeColor() {
        let homeTeamAbbrev = getValue(scheduleColumns.columns.homeTeam.nhlKey, game);
        let selectedTeamAbbrev = getValue(["teamAbbrev"], selectedTeams[0]);
        return selectedTeams.length === 1 && homeTeamAbbrev === selectedTeamAbbrev ? selectedTeamAbbrev : "default";
    }

    function getTeamLayout(abbreviation, team) {
        return <div className={"verticalFlex"}>
            <img className={"scheduleImage"} src={team.logo} alt={`${abbreviation} logo`}/>
            <span className={"teamAbbreviation"}>{abbreviation}</span>
            {
                showScores
                ? <span className={"teamAbbreviation"}>{getValue(["score"], team, false, "-").toLocaleString()}</span>
                : null
            }
        </div>;
    }

    function getTimeLayout(date) {
        return <div className={"verticalFlex"}>
            {isGameLive(getValue(["gameState"], game)) ? <span>LIVE</span> : null}
            {
                game.gameScheduleState === constants.scheduleState.toBeDetermined
                ? <span>TBD</span>
                : <>
                    <span>{formatterWeekday.format(date)}</span>
                    <span>{formatterDate.format(date)}</span>
                    <span>{formatterTime.format(date)}</span>
                </>
            }
        </div>;
    }

    function getContents(column) {
        let columns = scheduleColumns.columns;
        let value = getValue(column.nhlKey, game);
        switch (column) {
            case columns.awayTeam:
                return getTeamLayout(value, getValue(column.nhlKey.slice(0, 1), game, false, undefined));
            case columns.homeTeam:
                return getTeamLayout(value, getValue(column.nhlKey.slice(0, 1), game, false, undefined));
            case columns.startTimeUTC:
                return getTimeLayout(new Date(value));
            case columns.gameType:
                return getGameType(game);
            default:
                return value === undefined ? "N/A" : column.numeric ? value.toLocaleString() : value;
        }
    }

    async function openDialogKeyboard(event, gameID) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            await openDialog(gameID);
        }
    }

    async function openDialog(gameID) {
        setSelectedGame({});
        if (gameID) {
            setFetchState(constants.fetchState.loading);
            dialog.current.showModal();
            try {
                let response = await fetch(`${constants.baseURL}/schedule/getGame/${gameID}`);
                if (response.ok) {
                    setSelectedGame(await response.json());
                    setFetchState(constants.fetchState.finished);
                } else {
                    setFetchState(constants.fetchState.error);
                }
            } catch (ignored) {
                setFetchState(constants.fetchState.error);
            }
        }
    }

    return <tr className={getHomeColor()}
               role={"button"}
               tabIndex={0}
               onClick={() => openDialog(game.id)}
               onKeyDown={event => openDialogKeyboard(event, game.id)}>
        <td>{getOrdinalNumber(index + 1)}</td>
        {
            Object.keys(scheduleColumns.columns).map((column, columnIndex) =>
                <td key={column + columnIndex.toString()}>
                    {getContents(scheduleColumns.columns[column])}
                </td>
            )
        }
    </tr>;
}

export default TableRow;
