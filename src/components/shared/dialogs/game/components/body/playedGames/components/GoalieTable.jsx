import {useEffect, useRef, useState} from "react";
import constants from "../../../../../../../../data/constants.json";
import goalieData from "../../../../../../../../data/goalieStats.json";
import {
    getOrdinalNumber,
    getPlayerName,
    parseDecimals,
    parseIceTime
} from "../../../../../../../../scripts/parsing.js";
import {
    compareNumeric,
    compareTextual,
    getPlayer,
    getPlayerKeyboard,
    getValue,
    sortObjects
} from "../../../../../../../../scripts/utils.js";
import TableHeader from "../../../../../../table/TableHeader.jsx";

function defaultCompare(a, b) {
    if (!a.savePctg) {
        return -b.savePctg;
    }
    if (!b.savePctg) {
        return a.savePctg;
    }
    let savePctgA = parseFloat(a.savePctg);
    let savePctgB = parseFloat(b.savePctg);
    if (savePctgA.toFixed(2) === savePctgB.toFixed(2)) {
        if (a.goalsAgainst === b.goalsAgainst) {
            return compareTextual(a.name.default, b.name.default);
        }
        return compareNumeric(a.goalsAgainst, b.goalsAgainst);
    }
    return compareNumeric(savePctgA, savePctgB);
}

function compareName(player1, player2) {
    let nameKey = goalieData.columns.player.nhlKey;
    let lastName1 = getValue(nameKey, player1).split(".")[1];
    let lastName2 = getValue(nameKey, player2).split(".")[1];
    let lastNameDifference = compareTextual(lastName1, lastName2);
    return lastNameDifference === 0 ? defaultCompare(player1, player2) : lastNameDifference;
}

function compareRole(player1, player2) {
    let roleKey = goalieData.columns.role.nhlKey;
    let role1 = getValue(roleKey, player1);
    let role2 = getValue(roleKey, player2);
    let roleDifference = compareNumeric(Number(role1), Number(role2));
    return roleDifference === 0 ? defaultCompare(player1, player2) : roleDifference;
}

function compareShotsAgainst(player1, player2) {
    let shotsAgainstA = player1.saveShotsAgainst ? parseInt(player1.saveShotsAgainst.split("/")[1]) : 0;
    let shotsAgainstB = player2.saveShotsAgainst ? parseInt(player2.saveShotsAgainst.split("/")[1]) : 0;
    let shotsAgainstDifference = compareNumeric(shotsAgainstA, shotsAgainstB);
    return shotsAgainstDifference === 0 ? defaultCompare(player1, player2) : shotsAgainstDifference;
}

function GoalieTable({goalies, team, setPlayer, setActiveView, setPreviousView, setFetchState}) {
    const [sorting, setSorting] = useState({key: "savePctg", ascending: false, target: null});
    const [sortedGoalies, setSortedGoalies] = useState([]);
    const [sortedColumn, setSortedColumn] = useState(0);
    const defaultHeader = useRef(null);
    const defaultSortedCategory = goalieData.columns.savePercentage;

    function applySorting(key, ascending, target) {
        if (sorting.target) {
            sorting.target.classList.remove(constants.sortedColumnClassName);
            sorting.target.children[0].textContent = "";
        }
        if (target) {
            target.classList.add(constants.sortedColumnClassName);
            target.children[0].textContent = ascending ? constants.indicator.ascending : constants.indicator.descending;
            setSortedColumn(target.parentNode.cellIndex - 1);
        }
        setSorting({key, ascending, target});
    }

    function sortGoalies() {
        if (sorting.key) {
            let goalieCopy = [...goalies];
            switch (sorting.key) {
                case goalieData.columns.player:
                    goalieCopy.sort(compareName);
                    break;
                case goalieData.columns.role:
                    goalieCopy.sort(compareRole);
                    break;
                case goalieData.columns.shotsAgainst:
                    goalieCopy.sort(compareShotsAgainst);
                    break;
                default:
                    sortObjects(goalieCopy, sorting.key.nhlKey, sorting.key.numeric, defaultCompare);
                    break;
            }
            setSortedGoalies(sorting.ascending ? goalieCopy : goalieCopy.reverse());
        }
    }

    function getContents(goalie, column) {
        let columns = goalieData.columns;
        let value = getValue(column.nhlKey, goalie);
        switch (column) {
            case columns.player:
                return <span className={"playerName"}>{getPlayerName(goalie)}</span>;
            case columns.role:
                return value ? "Starter" : "Backup";
            case columns.decision:
                return value === undefined ? "N/A" : value;
            case columns.savePercentage:
                return value === undefined ? parseDecimals(0) : parseDecimals(value);
            case columns.shotsAgainst:
                return value === undefined ? parseInt("0").toLocaleString() : value.toLocaleString();
            case columns.timeOnIce:
                return value === undefined ? parseIceTime("00:00") : parseIceTime(value);
            default:
                return value === undefined ? "N/A" : column.numeric ? value.toLocaleString() : value;
        }
    }

    function setUpOnLoad() {
        applySorting(defaultSortedCategory, false, defaultHeader.current);
    }

    useEffect(sortGoalies, [goalies, sorting.key, sorting.ascending]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <div className={"gamesTableWithHeader"}>
        <h4 className={`${team} border`}>{team}</h4>
        <table className={"tableAlternateRows gamesTable"} aria-label={"Goalie table"}>
            <thead>
                <tr>
                    <th title={"Number"}>#</th>
                    <TableHeader data={goalieData}
                                 sortedColumn={sortedColumn}
                                 sortingFunction={applySorting}
                                 sortingDirection={sorting.ascending}
                                 defaultHeader={defaultHeader}
                                 defaultColumn={defaultSortedCategory}>
                    </TableHeader>
                </tr>
            </thead>
            <tbody>
                {
                    sortedGoalies.map((goalie, index) =>
                        <tr key={goalie.playerId}
                            role={"button"}
                            tabIndex={0}
                            onClick={() =>
                                getPlayer(goalie.playerId,
                                    setPlayer,
                                    setFetchState,
                                    setActiveView,
                                    setPreviousView)}
                            onKeyDown={event =>
                                getPlayerKeyboard(event,
                                    goalie.playerId,
                                    setPlayer,
                                    setFetchState,
                                    setActiveView,
                                    setPreviousView)}>
                            <td>{getOrdinalNumber(index + 1)}</td>
                            {
                                Object.keys(goalieData.columns).map((column, columnIndex) =>
                                    <td key={column + columnIndex.toString()}
                                        className={columnIndex === sortedColumn ? "selectedColumn" : ""}>
                                        {getContents(goalie, goalieData.columns[column])}
                                    </td>
                                )
                            }
                        </tr>
                    )
                }
            </tbody>
        </table>
    </div>;
}

export default GoalieTable;
