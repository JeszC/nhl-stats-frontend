import {Fragment, useCallback, useEffect, useMemo, useRef, useState} from "react";
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
    const [sorting, setSorting] = useState({key: "", ascending: true});
    const [selectedGame, setSelectedGame] = useState({});
    const [gameInfoFetchState, setGameInfoFetchState] = useState(constants.fetchState.finished);
    const [page, setPage] = useState(0);
    const defaultHeader = useRef(null);
    const dialog = useRef(null);
    const previousTargetElement = useRef(null);
    const numberOfGamesToShowPerPage = 50;
    const defaultSortedCategory = scheduleColumns.columns.startTimeUTC;

    const filteredSchedule = useMemo(() => {
        let filtered = filterSchedule(games, filterUpcomingGames);
        sortSchedule(sorting.key, filtered);
        return sorting.ascending ? filtered : filtered.reverse();
    }, [games, filterUpcomingGames, sorting.key, sorting.ascending]);

    const safePage = useMemo(() => {
        const maxPage = Math.max(0, Math.floor(filteredSchedule.length / numberOfGamesToShowPerPage));
        return Math.min(page, maxPage);
    }, [page, filteredSchedule.length, numberOfGamesToShowPerPage]);

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

    const applySorting = useCallback((key, ascending, target) => {
        if (previousTargetElement.current) {
            previousTargetElement.current.classList.remove(constants.sortedColumnClassName);
            previousTargetElement.current.children[0].textContent = "";
        }
        if (target) {
            target.classList.add(constants.sortedColumnClassName);
            target.children[0].textContent = ascending ? constants.indicator.ascending : constants.indicator.descending;
            previousTargetElement.current = target;
        }
        setSorting({key, ascending});
    }, []);

    function renderGames() {
        let upperLimit = Math.min((safePage + 1) * numberOfGamesToShowPerPage, filteredSchedule.length);
        let rows = [];
        for (let i = safePage * numberOfGamesToShowPerPage; i < upperLimit; i++) {
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

    useEffect(() => {
        applySorting(defaultSortedCategory, true, defaultHeader.current);
    }, [applySorting, defaultSortedCategory]);

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
