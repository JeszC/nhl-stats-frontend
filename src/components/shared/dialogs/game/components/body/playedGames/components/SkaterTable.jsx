import {useCallback, useEffect, useRef, useState} from "react";
import constants from "../../../../../../../../data/constants.json";
import skaterData from "../../../../../../../../data/skaterStats.json";
import {getOrdinalNumber, getPlayerName, parseDecimals, parseIceTime} from "../../../../../../../../scripts/parsing.js";
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
    if (a.points === b.points) {
        if (a.goals === b.goals) {
            if (a.assists === b.assists) {
                if (a.plusMinus === b.plusMinus) {
                    return compareNumeric(a.shots, b.shots);
                }
                return compareNumeric(a.plusMinus, b.plusMinus);
            }
            return compareNumeric(a.assists, b.assists);
        }
        return compareNumeric(a.goals, b.goals);
    }
    return compareNumeric(a.points, b.points);
}

function compareName(player1, player2) {
    let nameKey = skaterData.columns.player.nhlKey;
    let lastName1 = getValue(nameKey, player1).split(".")[1];
    let lastName2 = getValue(nameKey, player2).split(".")[1];
    let lastNameDifference = compareTextual(lastName1, lastName2);
    return lastNameDifference === 0 ? defaultCompare(player1, player2) : lastNameDifference;
}

function SkaterTable({skaters, team, setPlayer, setActiveView, setPreviousView, setFetchState}) {
    const [sorting, setSorting] = useState({key: "", ascending: false});
    const [sortedSkaters, setSortedSkaters] = useState([]);
    const [sortedColumn, setSortedColumn] = useState(0);
    const previousTargetElement = useRef(null);
    const defaultHeader = useRef(null);
    const defaultSortedCategory = skaterData.columns.points;

    const applySorting = useCallback((key, ascending, target) => {
        if (previousTargetElement.current) {
            previousTargetElement.current.classList.remove(constants.sortedColumnClassName);
            previousTargetElement.current.children[0].textContent = "";
        }
        if (target) {
            target.classList.add(constants.sortedColumnClassName);
            target.children[0].textContent = ascending ? constants.indicator.ascending : constants.indicator.descending;
            setSortedColumn(target.parentNode.cellIndex - 1);
        }
        previousTargetElement.current = target;
        setSorting({key, ascending});
    }, []);

    function getContents(skater, column) {
        let columns = skaterData.columns;
        let value = getValue(column.nhlKey, skater);
        switch (column) {
            case columns.player:
                return <span className={"playerName"}>{getPlayerName(skater)}</span>;
            case columns.faceoffPercentage:
                return value === undefined ? "N/A" : parseDecimals(value);
            case columns.timeOnIce:
                return value === undefined ? parseIceTime("00:00") : parseIceTime(value);
            default:
                return value === undefined ? "N/A" : column.numeric ? value.toLocaleString() : value;
        }
    }

    useEffect(() => {
        function sortSkaters() {
            if (sorting.key) {
                let skatersCopy = [...skaters];
                if (sorting.key === skaterData.columns.player) {
                    skatersCopy.sort(compareName);
                } else {
                    sortObjects(skatersCopy, sorting.key.nhlKey, sorting.key.numeric, defaultCompare);
                }
                setSortedSkaters(sorting.ascending ? skatersCopy : skatersCopy.reverse());
            }
        }

        sortSkaters();
    }, [skaters, sorting.key, sorting.ascending]);

    useEffect(() => {
        applySorting(defaultSortedCategory, false, defaultHeader.current);
    }, [applySorting, defaultSortedCategory]);

    return <div className={"gamesTableWithHeader"}>
        <h4 className={`${team} border`}>{team}</h4>
        <table className={"tableAlternateRows gamesTable"} aria-label={"Skater table"}>
            <thead>
                <tr>
                    <th title={"Number"}>#</th>
                    <TableHeader data={skaterData}
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
                    sortedSkaters.map((skater, index) =>
                        <tr key={skater.playerId}
                            role={"button"}
                            tabIndex={0}
                            onClick={() =>
                                getPlayer(skater.playerId,
                                    setPlayer,
                                    setFetchState,
                                    setActiveView,
                                    setPreviousView)}
                            onKeyDown={event =>
                                getPlayerKeyboard(event,
                                    skater.playerId,
                                    setPlayer,
                                    setFetchState,
                                    setActiveView,
                                    setPreviousView)}>
                            <td>{getOrdinalNumber(index + 1)}</td>
                            {
                                Object.keys(skaterData.columns).map((column, columnIndex) =>
                                    <td key={column + columnIndex.toString()}
                                        className={columnIndex === sortedColumn ? "selectedColumn" : ""}>
                                        {getContents(skater, skaterData.columns[column])}
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

export default SkaterTable;
