import constants from "../../../../data/constants.json";
import {
    getOrdinalNumber,
    getPlayerFullName,
    parseDecimals,
    parseIceTimeFromTotalTime
} from "../../../../scripts/parsing.js";
import homeCategories from "../../../../data/home.json";

function PlayerTable({dialog, category, players, setSelectedPlayer, setFetchState}) {

    async function openDialogKeyboard(event, playerID) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            await openDialog(playerID);
        }
    }

    async function openDialog(playerID) {
        setSelectedPlayer({});
        if (playerID) {
            setFetchState(constants.fetchState.loading);
            dialog.current.showModal();
            try {
                let response = await fetch(`${constants.baseURL}/players/getPlayer/${playerID}`);
                if (response.ok) {
                    setSelectedPlayer(await response.json());
                    setFetchState(constants.fetchState.finished);
                } else {
                    setFetchState(constants.fetchState.error);
                }
            } catch (ignored) {
                setFetchState(constants.fetchState.error);
            }
        }
    }

    return <table className={"homeTable tableAlternateRows"} aria-label={"Player table"}>
        <thead>
            <tr>
                <th title={"Number"}>#</th>
                <th title={"Player"}>PLAYER</th>
                <th title={"Team"}>TEAM</th>
                <th title={"Position"}>POS</th>
                <th title={category ? category.title : ""}>{category ? category.text : ""}</th>
            </tr>
        </thead>
        <tbody>
            {
                players
                ? players.map((player, index) =>
                    <tr key={player.id}
                        role={"button"}
                        tabIndex={0}
                        onClick={() => openDialog(player.id)}
                        onKeyDown={event => openDialogKeyboard(event, player.id)}>
                        <td>{getOrdinalNumber(index + 1)}</td>
                        <td className={"horizontalFlex teamLogoAndName"}>
                            <img className={`defaultImage default ${player.teamAbbrev} gradient`}
                                 src={player.headshot}
                                 alt={`${getPlayerFullName(player)} headshot`}/>
                            <span>{getPlayerFullName(player)}</span>
                        </td>
                        <td>{player.teamAbbrev}</td>
                        <td>{player.position}</td>
                        <td>
                            {
                                category === homeCategories.lowerCategoriesSkater.timeOnIce
                                ? parseIceTimeFromTotalTime(player.value)
                                : category === homeCategories.lowerCategoriesGoalie.goalsAgainstAverage
                                  ? parseDecimals(player.value, 1)
                                  : category === homeCategories.lowerCategoriesGoalie.savePercentage
                                    || category === homeCategories.lowerCategoriesSkater.faceOffWinPercentage
                                    ? parseDecimals(player.value)
                                    : parseInt(player.value).toLocaleString()
                            }
                        </td>
                    </tr>
                )
                : null
            }
        </tbody>
    </table>;
}

export default PlayerTable;
