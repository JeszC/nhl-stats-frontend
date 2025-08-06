import constants from "../../../../data/constants.json";
import draftColumns from "../../../../data/draft.json";
import {getOrdinalNumber} from "../../../../scripts/parsing.js";
import {getValue} from "../../../../scripts/utils.js";
import placeholderLogoIcon from "../../../shared/images/QuestionMark.svg";

function TableRow({player, index, sortedColumn, teams, dialog, setSelectedPlayer, setPlayerFetchState}) {
    const formatterDate = new Intl.DateTimeFormat(undefined, {day: "2-digit", month: "2-digit", year: "numeric"});

    function getContents(column) {
        let columns = draftColumns.columns;
        let value = getValue(column.nhlKey, player);
        switch (column) {
            case columns.player:
                return !value || value === "Void" ? "N/A" : value;
            case columns.draftTeam:
                return <div className={"horizontalFlex draftTeam"}>
                    {getTeamLogo(value)}
                    <span>{value}</span>
                </div>;
            case columns.countryCode:
                if (player.countryFlag) {
                    return <div className={"horizontalFlex playersCountryOfBirth"}>
                        <img src={player.countryFlag} alt={`${value} flag`} title={value}/>
                    </div>;
                }
                return value ? value : "N/A";
            case columns.birthPlace:
                return value ? value.split(",")[0] : "N/A";
            case columns.birthDate:
                return value ? formatterDate.format(new Date(value)) : "N/A";
            case columns.age:
                return value ? value.toLocaleString() : "N/A";
            case columns.height:
                return value ? Math.round(value * 2.54).toLocaleString() : "N/A";
            case columns.weight:
                return value ? Math.round(value * 0.45359237).toLocaleString() : "N/A";
            case columns.notes:
                if (value) {
                    return <details className={"draftNotes"}>
                        <summary>Show</summary>
                        {value}
                    </details>;
                }
                return "";
            default:
                return value === undefined || value === null ? "N/A" : column.numeric ? value.toLocaleString() : value;
        }
    }

    function getTeamLogo(draftTeamAbbreviation) {
        for (let team of teams) {
            if (team.abbrev === draftTeamAbbreviation) {
                return <img className={"draftImage"} src={team.logo} alt={`${draftTeamAbbreviation} logo`}/>;
            }
        }
        return <img className={"draftImage placeholder"}
                    src={placeholderLogoIcon}
                    alt={`${draftTeamAbbreviation} logo`}/>;
    }

    async function openDialogKeyboard(event, playerID) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            await openDialog(event, playerID);
        }
    }

    async function openDialog(event, playerID) {
        let nodeType = event.target.nodeName.trim().toLowerCase();
        if (nodeType !== "details" && nodeType !== "summary") {
            if (playerID) {
                setSelectedPlayer({});
                setPlayerFetchState(constants.fetchState.loading);
                dialog.current.showModal();
                try {
                    let response = await fetch(`${constants.baseURL}/players/getPlayer/${playerID}`);
                    if (response.ok) {
                        setSelectedPlayer(await response.json());
                        setPlayerFetchState(constants.fetchState.finished);
                    } else {
                        setPlayerFetchState(constants.fetchState.error);
                    }
                } catch (ignored) {
                    setPlayerFetchState(constants.fetchState.error);
                }
            }
        }
    }

    return <tr role={"button"}
               tabIndex={0}
               onClick={event => openDialog(event, player.playerId)}
               onKeyDown={event => openDialogKeyboard(event, player.playerId)}>
        <td>{getOrdinalNumber(index + 1)}</td>
        {
            Object.keys(draftColumns.columns).map((column, columnIndex) =>
                <td key={column + columnIndex.toString()}
                    className={columnIndex === sortedColumn ? "selectedColumn" : ""}>
                    {getContents(draftColumns.columns[column])}
                </td>
            )
        }
    </tr>;
}

export default TableRow;
