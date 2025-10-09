import {Fragment, useEffect, useRef, useState} from "react";
import constants from "../../../../../data/constants.json";
import scheduleColumns from "../../../../../data/schedule.json";
import {getValue, isGameFinished, sortObjects} from "../../../../../scripts/utils.js";
import PageBar from "../../../../shared/common/pageBar/PageBar.jsx";
import GameDialog from "../../../../shared/dialogs/game/GameDialog";
import GamesTable from "./components/GamesTable";
import TableRow from "./components/TableRow";

function defaultCompare(game1, game2) {
    let key = scheduleColumns.columns.startTimeUTC.nhlKey;
    let startTimeGame1 = getValue(key, game1);
    let startTimeGame2 = getValue(key, game2);
    return new Date(startTimeGame1) - new Date(startTimeGame2);
}

function ScheduleTable({games, selectedTeams, showScores, filterUpcomingGames}) {
    const [fullSchedule, setFullSchedule] = useState([]);
    const [filteredSchedule, setFilteredSchedule] = useState([]);
    const [sorting, setSorting] = useState({key: "", ascending: true, target: null});
    const [selectedGame, setSelectedGame] = useState({});
    const [gameInfoFetchState, setGameInfoFetchState] = useState(constants.fetchState.finished);
    const [page, setPage] = useState(0);
    const defaultHeader = useRef(null);
    const dialog = useRef(null);
    const numberOfGamesToShowPerPage = 50;
    const defaultSortedCategory = scheduleColumns.columns.startTimeUTC;

    function applySorting(key, ascending, target) {
        if (sorting.target) {
            sorting.target.classList.remove(constants.sortedColumnClassName);
            sorting.target.children[0].textContent = "";
        }
        if (target) {
            target.classList.add(constants.sortedColumnClassName);
            target.children[0].textContent = ascending ? constants.indicator.ascending : constants.indicator.descending;
        }
        setSorting({key, ascending, target});
    }

    function renderGames() {
        let upperLimit = Math.min((page + 1) * numberOfGamesToShowPerPage, filteredSchedule.length);
        let rows = [];
        for (let i = page * numberOfGamesToShowPerPage; i < upperLimit; i++) {
            let game = filteredSchedule[i];
            rows.push(
                <TableRow key={game.id + game.homeTeam.abbrev + i}
                          game={game}
                          index={i}
                          selectedTeams={selectedTeams}
                          showScores={showScores}
                          setSelectedGame={setSelectedGame}
                          dialog={dialog}
                          setFetchState={setGameInfoFetchState}>
                </TableRow>
            );
        }
        return rows;
    }

    function filterSchedule(schedule, filterUpcomingGames) {
        if (filterUpcomingGames) {
            return [].concat(schedule).filter(game => {
                let gameState = getValue(["gameState"], game);
                let startTime = getValue(scheduleColumns.columns.startTimeUTC.nhlKey, game);
                return !isGameFinished(gameState) || Date.parse(startTime) >= Date.now();
            });
        }
        return [].concat(schedule);
    }

    function sortSchedule(key, schedule) {
        if (key) {
            if (key === scheduleColumns.columns.startTimeUTC) {
                schedule.sort(defaultCompare);
            } else {
                sortObjects(schedule, key.nhlKey, key.numeric, defaultCompare);
            }
        }
    }

    function filterAndSortSchedule() {
        let filteredSchedule = filterSchedule(fullSchedule, filterUpcomingGames);
        sortSchedule(sorting.key, filteredSchedule);
        setFilteredSchedule(sorting.ascending ? filteredSchedule : filteredSchedule.reverse());
        setPage(0);
    }

    function updateSchedule() {
        setFullSchedule(games);
        setFilteredSchedule(games);
    }

    function setUpOnLoad() {
        applySorting(defaultSortedCategory, true, defaultHeader.current);
    }

    useEffect(filterAndSortSchedule, [filterUpcomingGames, fullSchedule, sorting.key, sorting.ascending]);

    useEffect(updateSchedule, [games]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <>
        {
            <>
                <GamesTable defaultHeader={defaultHeader}
                            defaultColumn={defaultSortedCategory}
                            applySorting={applySorting}
                            sortingDirection={sorting.ascending}
                            renderGames={renderGames}>
                </GamesTable>
                <PageBar items={filteredSchedule}
                         options={[showScores]}
                         numberOfItemsToShowPerPage={numberOfGamesToShowPerPage}
                         page={page}
                         setPage={setPage}>
                </PageBar>
            </>
        }
        <GameDialog dialogReference={dialog}
                    selectedGame={selectedGame}
                    fetchState={gameInfoFetchState}
                    setFetchState={setGameInfoFetchState}>
        </GameDialog>
    </>;
}

export default ScheduleTable;
