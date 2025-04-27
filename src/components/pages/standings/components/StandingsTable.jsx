import TableHeader from "../../../shared/table/TableHeader";
import TableRow from "./TableRow";

function StandingsTable({
                            defaultHeader,
                            defaultColumn,
                            applySorting,
                            sortingDirection,
                            sortedColumn,
                            columns,
                            standings,
                            dialog,
                            hasPlayoffTeams,
                            setSelectedTeam,
                            setTeamFetchState
                        }) {

    return <table className={"standingsTable tableAlternateRows"} aria-label={"Team standings table"}>
        <thead>
            <tr>
                <th title={"Number"}>#</th>
                <TableHeader data={columns}
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
                standings.map((team, index) =>
                    <TableRow key={team.teamName.default + index.toString()}
                              team={team}
                              index={index}
                              sortedColumn={sortedColumn}
                              data={columns}
                              hasPlayoffTeams={hasPlayoffTeams}
                              setSelectedTeam={setSelectedTeam}
                              dialog={dialog}
                              setTeamFetchState={setTeamFetchState}>
                    </TableRow>
                )
            }
        </tbody>
    </table>;
}

export default StandingsTable;
