import clinchIndicators from "../../../../data/clinchIndicators.json";
import constants from "../../../../data/constants.json";
import {capitalize, formatAndParseRecord, getOrdinalNumber, parseDecimals} from "../../../../scripts/parsing.js";
import {getValue} from "../../../../scripts/utils.js";

function TableRow({team, index, sortedColumn, data, hasPlayoffTeams, setSelectedTeam, dialog, setTeamFetchState}) {

    function getContents(column) {
        let columns = data.columns;
        let value = getValue(column.nhlKey, team);
        switch (column) {
            case columns.team:
                return <div className={"horizontalFlex"}>
                    {getClinchIndicator()}
                    <img className={"standingsImage"}
                         src={team.teamLogo}
                         alt={`${team.teamAbbrev.default} logo`}/>
                    <span>{value}</span>
                </div>;
            case columns.pointPercentage:
                return value === undefined ? parseDecimals(0, 1, 3) : parseDecimals(value, 1, 3);
            case columns.record:
                return formatAndParseRecord(getValue(column.nhlKey, team, true));
            case columns.last10:
                return formatAndParseRecord(getValue(column.nhlKey, team, true));
            case columns.streak: {
                let values = getValue(column.nhlKey, team, true);
                if (values[0] !== undefined && values[1] !== undefined) {
                    return `${values[0]}${values[1].toLocaleString()}`;
                }
                return "N/A";
            }
            case columns.homeRecord:
                return formatAndParseRecord(getValue(column.nhlKey, team, true));
            case columns.awayRecord:
                return formatAndParseRecord(getValue(column.nhlKey, team, true));
            case columns.faceoffWinPercentage:
                return value === undefined ? "N/A" : parseDecimals(value);
            case columns.powerPlayPercentage:
                return value === undefined ? "N/A" : parseDecimals(value);
            case columns.penaltyKillPercentage:
                return value === undefined ? "N/A" : parseDecimals(value);
            case columns.penaltyMinutesPerGame:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            case columns.shotsForPerGame:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            case columns.shotsAgainstPerGame:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            case columns.goalsForPerGame:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            case columns.goalsAgainstPerGame:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            default:
                return value === undefined ? "N/A" : column.numeric ? value.toLocaleString() : value;
        }
    }

    function getClinchIndicator() {
        if (hasPlayoffTeams) {
            let clinchIndicator = capitalize(getValue(["clinchIndicator"], team, false, undefined));
            if (clinchIndicator) {
                let text = clinchIndicators?.columns?.[clinchIndicator]?.text;
                let title = clinchIndicators?.columns?.[clinchIndicator]?.title;
                let className = clinchIndicators?.columns?.[clinchIndicator]?.class;
                return <div className={`clinchedSpot ${className}`} title={title}>{text}</div>;
            }
            return <div className={"clinchedSpot transparent"}></div>;
        }
        return null;
    }

    function getClassName(column, columnIndex) {
        let values = [];
        if (columnIndex === sortedColumn) {
            values.push("selectedColumn");
        }
        if (column.extraClass) {
            values.push(column.extraClass);
        }
        return values.join(" ");
    }

    async function openDialogKeyboard(event, team) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            await openDialog(team);
        }
    }

    async function openDialog(team) {
        setSelectedTeam({});
        if (team) {
            setTeamFetchState(constants.fetchState.loading);
            dialog.current.showModal();
            try {
                let url = `${constants.baseURL}/teams/getTeam/${team.teamAbbrev.default}/${team.seasonId}`;
                let response = await fetch(url);
                if (response.ok) {
                    setSelectedTeam(await response.json());
                    setTeamFetchState(constants.fetchState.finished);
                } else {
                    setTeamFetchState(constants.fetchState.error);
                }
            } catch (ignored) {
                setTeamFetchState(constants.fetchState.error);
            }
        }
    }

    return <tr role={"button"}
               tabIndex={0}
               onClick={() => openDialog(team)}
               onKeyDown={event => openDialogKeyboard(event, team)}>
        <td>{getOrdinalNumber(index + 1)}</td>
        {
            Object.keys(data.columns).map((column, columnIndex) =>
                <td key={column + columnIndex.toString()}
                    className={getClassName(data.columns[column], columnIndex)}>
                    {getContents(data.columns[column])}
                </td>
            )
        }
    </tr>;
}

export default TableRow;
