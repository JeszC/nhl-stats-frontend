import {
    getOrdinalNumber,
    getPlayerFullName,
    parseDecimals,
    parseIceTimeFromTotalTime
} from "../../../../../../scripts/parsing.js";
import {getValue} from "../../../../../../scripts/utils.js";

function TableRow({player, playerStandings, openDialog, openDialogKeyboard, index, sortedColumn}) {

    function getContents(column) {
        let columns = playerStandings.columns;
        let value = getValue(column.nhlKey, player);
        switch (column) {
            case columns.player:
                return <div className={"horizontalFlex"}>
                    <img className={`defaultImage default ${player.team} gradient`}
                         src={player.headshot}
                         alt={`${getPlayerFullName(player)} headshot`}/>
                    <span>{getPlayerFullName(player)}</span>
                </div>;
            case columns.country:
                return <div className={"horizontalFlex playersCountryOfBirth"}>
                    {
                        player.countryFlag
                        ? <img src={player.countryFlag}
                               alt={`${player.birthCountry} flag`}
                               title={player.birthCountry}/>
                        : "N/A"
                    }
                </div>;
            case columns.age:
                return value === undefined ? "N/A" : Math.floor(value).toLocaleString();
            case columns.timeOnIcePerGame:
                return value === undefined ? "N/A" : parseIceTimeFromTotalTime(value);
            case columns.shiftsPerGame:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            case columns.faceoffWinPercentage:
                return value === undefined ? "N/A" : parseDecimals(value);
            case columns.shootingPercentage:
                return value === undefined ? "N/A" : parseDecimals(value);
            case columns.shotsPerGame:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            case columns.goalsAgainstAverage:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            case columns.shotsAgainstPerGame:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            case columns.savePercentage:
                return value === undefined ? "N/A" : parseDecimals(value);
            case columns.savesPerGame:
                return value === undefined ? "N/A" : parseDecimals(value, 1);
            default:
                return value === undefined ? "N/A" : column.numeric ? value.toLocaleString() : value;
        }
    }

    return <tr role={"button"}
               tabIndex={0}
               onClick={() => openDialog(player.playerId)}
               onKeyDown={event => openDialogKeyboard(event, player.playerId)}>
        <td>{getOrdinalNumber(index + 1)}</td>
        {
            Object.keys(playerStandings.columns).map((column, columnIndex) =>
                <td key={column + columnIndex.toString()}
                    className={columnIndex === sortedColumn ? "selectedColumn" : ""}>
                    {getContents(playerStandings.columns[column])}
                </td>
            )
        }
    </tr>;
}

export default TableRow;
