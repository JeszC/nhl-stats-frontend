import draft from "../../../../data/draft.json";
import TableHeader from "../../../shared/table/TableHeader";
import TableRow from "./TableRow";

function DraftTable({
                        defaultHeader,
                        defaultColumn,
                        applySorting,
                        sortingDirection,
                        sortedColumn,
                        draftResults,
                        teams,
                        dialog,
                        setSelectedPlayer,
                        setPlayerFetchState
                    }) {

    return <table className={"draftTable tableAlternateRows"} aria-label={"Draft pick table"}>
        <thead>
            <tr>
                <th title={"Number"}>#</th>
                <TableHeader data={draft}
                             sortedColumn={sortedColumn}
                             sortingFunction={applySorting}
                             sortingDirection={sortingDirection}
                             defaultHeader={defaultHeader}
                             defaultColumn={defaultColumn}>
                </TableHeader>
            </tr>
        </thead>
        <tbody>
            {
                draftResults.map((player, index) =>
                    <TableRow key={player.id}
                              player={player}
                              index={index}
                              sortedColumn={sortedColumn}
                              teams={teams}
                              dialog={dialog}
                              setSelectedPlayer={setSelectedPlayer}
                              setPlayerFetchState={setPlayerFetchState}>
                    </TableRow>
                )
            }
        </tbody>
    </table>;
}

export default DraftTable;
