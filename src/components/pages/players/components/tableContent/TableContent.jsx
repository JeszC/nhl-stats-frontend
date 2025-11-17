import constants from "../../../../../data/constants.json";
import goalieStandings from "../../../../../data/goalieStandings.json";
import skaterStandings from "../../../../../data/skaterStandings.json";
import TableRow from "./components/TableRow.jsx";

function TableContent({
                          showGoalies,
                          goalies,
                          skaters,
                          sortedColumn,
                          setSelectedPlayer,
                          dialog,
                          setPlayerFetchState,
                          page,
                          numberOfPlayersToShowPerPage
                      }) {

    async function openDialog(playerID) {
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

    async function openDialogKeyboard(event, playerID) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            await openDialog(playerID);
        }
    }

    function renderPlayers(isGoalies) {
        let players = isGoalies ? goalies : skaters;
        let upperLimit = Math.min((page + 1) * numberOfPlayersToShowPerPage, players.length);
        let rows = [];
        for (let i = page * numberOfPlayersToShowPerPage; i < upperLimit; i++) {
            let player = players[i];
            rows.push(
                <TableRow key={`${player.playerId} ${player.team}`}
                          player={player}
                          playerStandings={isGoalies ? goalieStandings : skaterStandings}
                          openDialog={openDialog}
                          openDialogKeyboard={openDialogKeyboard}
                          index={i}
                          sortedColumn={sortedColumn}>
                </TableRow>
            );
        }
        return rows;
    }

    return <>
        {
            renderPlayers(showGoalies)
        }
    </>;
}

export default TableContent;
