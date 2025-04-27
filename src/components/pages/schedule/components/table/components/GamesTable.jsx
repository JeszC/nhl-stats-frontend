import schedule from "../../../../../../data/schedule.json";
import TableHeader from "../../../../../shared/table/TableHeader";

function GamesTable({defaultHeader, defaultColumn, applySorting, sortingDirection, renderGames}) {

    return <table className={"scheduleTable"} aria-label={"Team schedule table"}>
        <thead>
            <tr>
                <th title={"Number"}>#</th>
                <TableHeader data={schedule}
                             sortingFunction={applySorting}
                             sortingDirection={sortingDirection}
                             defaultHeader={defaultHeader}
                             defaultColumn={defaultColumn}>
                </TableHeader>
            </tr>
        </thead>
        <tbody>
            {renderGames()}
        </tbody>
    </table>;
}

export default GamesTable;
