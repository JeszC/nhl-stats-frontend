import {useRef, useState} from "react";
import constants from "../../../../data/constants.json";
import GameBox from "../../../shared/common/gameBox/GameBox.jsx";
import GameDialog from "../../../shared/dialogs/game/GameDialog";

function UpcomingGames({games}) {
    const dialog = useRef(null);
    const [selectedGame, setSelectedGame] = useState({});
    const [fetchState, setFetchState] = useState(constants.fetchState.finished);

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
                }
            } catch (ignored) {
                setFetchState(constants.fetchState.error);
            }
        }
    }

    return <div className={"upcomingGames"}>
        {
            games.length > 0 ? <h2 id={"upcomingGames"}>Upcoming games</h2> : null
        }
        <div className={"todayGames"}>
            {
                games.map(game =>
                    <GameBox key={game.id} game={game} onClick={openDialog}></GameBox>
                )
            }
        </div>
        <GameDialog dialogReference={dialog}
                    selectedGame={selectedGame}
                    fetchState={fetchState}
                    setFetchState={setFetchState}>
        </GameDialog>
    </div>;
}

export default UpcomingGames;
