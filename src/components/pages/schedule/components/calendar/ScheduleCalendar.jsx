import {useEffect, useEffectEvent, useRef, useState} from "react";
import constants from "../../../../../data/constants.json";
import GameDialog from "../../../../shared/dialogs/game/GameDialog";
import ErrorDialogSeasonUnstarted from "../../../../shared/errors/ErrorDialogSeasonUnstarted.jsx";
import CalendarHeader from "./components/calendarheader/CalendarHeader";
import CalendarSquare from "./components/calendarsquare/CalendarSquare";
import "../../Schedule.css";

function ScheduleCalendar({season, games, selectedTeams, showScores, startDate, endDate}) {
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [seasonStart, setSeasonStart] = useState(null);
    const [seasonEnd, setSeasonEnd] = useState(null);
    const [selectedGame, setSelectedGame] = useState({});
    const [gameFetchState, setGameFetchState] = useState(constants.fetchState.finished);
    const dialog = useRef(null);

    async function openDialog(gameID) {
        setSelectedGame({});
        if (gameID) {
            setGameFetchState(constants.fetchState.loading);
            dialog.current.showModal();
            try {
                let response = await fetch(`${constants.baseURL}/schedule/getGame/${gameID}`);
                if (response.ok) {
                    setSelectedGame(await response.json());
                    setGameFetchState(constants.fetchState.finished);
                } else {
                    setGameFetchState(constants.fetchState.error);
                }
            } catch (ignored) {
                setGameFetchState(constants.fetchState.error);
            }
        }
    }

    function getMonthData(monthlyGames) {
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let firstDay = new Date(year, month, 1).getDay();
        let previousMonthDaysToFillGrid = firstDay === 0 ? 6 : firstDay - 1;
        let lastDay = new Date(year, month, daysInMonth).getDay();
        let nextMonthDaysToFillGrid = lastDay === 0 ? 0 : 7 - lastDay;
        let days = [];
        for (let day = -previousMonthDaysToFillGrid + 1; day <= daysInMonth + nextMonthDaysToFillGrid; day++) {
            let date = new Date(year, month, day);
            let dateGames = [];
            let isThisMonth = date.getMonth() === month;
            if (isThisMonth) {
                dateGames = monthlyGames.filter(game => new Date(game.startTimeUTC).getDate() === date.getDate());
                dateGames.sort((a, b) => new Date(a.startTimeUTC) - new Date(b.startTimeUTC));
            }
            days.push({date, games: dateGames, isThisMonth});
        }
        return days;
    }

    function getCalendarData() {
        let monthlyGames = games.filter(game => {
            let gameDate = new Date(game.startTimeUTC);
            return gameDate.getMonth() === month && gameDate.getFullYear() === year;
        });
        return getMonthData(monthlyGames);
    }

    function getSeasonStartMonth(start, end) {
        let january = 0;
        let september = 8;
        for (let season of constants.seasonsStartingInJanuary) {
            if (start.getFullYear() === season + 1 && end.getFullYear() === season + 1) {
                return january;
            }
        }
        return start.getMonth() > september ? september : start.getMonth();
    }

    function getSeasonEndMonth(end) {
        let august = 7;
        let september = 8;
        for (let season of constants.seasonsEndingInSeptember) {
            if (end.getFullYear() === season) {
                return september;
            }
        }
        return end.getMonth() < august ? august : end.getMonth();
    }

    function hasSeasonStarted() {
        let start = season.substring(0, 4);
        let end = season.substring(4);
        return start - seasonStart?.getFullYear() < 1 && end - seasonEnd?.getFullYear() <= 1;
    }

    const updateSeasonDates = useEffectEvent(() => {
        let start = new Date(startDate);
        let end = new Date(endDate);
        setSeasonStart(new Date(start.getFullYear(), getSeasonStartMonth(start, end), start.getDate()));
        if (end <= start && start >= new Date()) {
            setSeasonEnd(new Date(end.getFullYear() + 1, getSeasonStartMonth(end), end.getDate()));
        } else {
            setSeasonEnd(new Date(end.getFullYear(), getSeasonEndMonth(end), end.getDate()));
        }
    });

    useEffect(() => {
        updateSeasonDates();
    }, [startDate, endDate]);

    return <>
        {
            hasSeasonStarted()
            ? <>
                <CalendarHeader year={year}
                                month={month}
                                setYear={setYear}
                                setMonth={setMonth}
                                seasonStart={seasonStart}
                                seasonEnd={seasonEnd}>
                </CalendarHeader>
                <ul className={"days"}>
                    {
                        getCalendarData().map((date, index) =>
                            <CalendarSquare key={date.date.toLocaleDateString() + index.toString()}
                                            date={date}
                                            selectedTeams={selectedTeams}
                                            showScores={showScores}
                                            openDialog={openDialog}>
                            </CalendarSquare>
                        )
                    }
                </ul>
            </>
            : <ErrorDialogSeasonUnstarted></ErrorDialogSeasonUnstarted>
        }
        <GameDialog dialogReference={dialog}
                    selectedGame={selectedGame}
                    fetchState={gameFetchState}
                    setFetchState={setGameFetchState}>
        </GameDialog>
    </>;
}

export default ScheduleCalendar;
