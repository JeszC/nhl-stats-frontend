import {useEffect} from "react";

function CalendarHeader({year, month, setYear, setMonth, seasonStart, seasonEnd}) {

    function getWeekDayNames(type) {
        let baseDate = new Date(Date.UTC(1970, 0, 5));
        let weekDays = [];
        for (let i = 0; i < 7; i++) {
            weekDays.push(baseDate.toLocaleDateString([], {weekday: type}));
            baseDate.setUTCDate(baseDate.getUTCDate() + 1);
        }
        return weekDays;
    }

    function toSeasonStart() {
        setYear(seasonStart.getFullYear());
        setMonth(seasonStart.getMonth());
    }

    function toPreviousMonth() {
        if (year > seasonStart.getFullYear() || year === seasonStart.getFullYear() && month > seasonStart.getMonth()) {
            if (month === 0) {
                setMonth(11);
                setYear(year - 1);
            } else {
                setMonth(month - 1);
            }
        }
    }

    function toNextMonth() {
        if (year < seasonEnd.getFullYear() || year === seasonEnd.getFullYear() && month < seasonEnd.getMonth()) {
            if (month === 11) {
                setMonth(0);
                setYear(year + 1);
            } else {
                setMonth(month + 1);
            }
        }
    }

    function toSeasonEnd() {
        setYear(seasonEnd.getFullYear());
        setMonth(seasonEnd.getMonth());
    }

    function setCalendarDefaultView() {
        if (seasonStart && seasonEnd) {
            let today = new Date();
            if (today > seasonStart && today < seasonEnd) {
                setMonth(today.getMonth());
                setYear(today.getFullYear());
            } else {
                setMonth(seasonStart.getMonth());
                setYear(seasonStart.getFullYear());
            }
        }
    }

    useEffect(setCalendarDefaultView, [seasonStart, seasonEnd, setMonth, setYear]);

    return <div className={"calendarHeader"}>
        <div className={"horizontalFlex"}>
            <button type={"button"} className={"transparentButton"}
                    title={"To season start"}
                    onClick={toSeasonStart}
                    disabled={seasonStart && year <= seasonStart.getFullYear() && month <= seasonStart.getMonth()}>
                <span>«</span>
            </button>
            <button type={"button"}
                    className={"transparentButton"}
                    title={"To previous month"}
                    onClick={toPreviousMonth}
                    disabled={seasonStart && year <= seasonStart.getFullYear() && month <= seasonStart.getMonth()}>
                <span>‹</span>
            </button>
            <span className={"monthLong"}>
                {new Date(year, month, 1).toLocaleDateString([], {month: "long", year: "numeric"})}
            </span>
            <span className={"monthShort"}>
                {new Date(year, month, 1).toLocaleDateString([], {month: "short", year: "numeric"})}
            </span>
            <button type={"button"}
                    className={"transparentButton"}
                    title={"To next month"}
                    onClick={toNextMonth}
                    disabled={seasonEnd && year >= seasonEnd.getFullYear() && month >= seasonEnd.getMonth()}>
                <span>›</span>
            </button>
            <button type={"button"}
                    className={"transparentButton"}
                    title={"To season end"}
                    onClick={toSeasonEnd}
                    disabled={seasonEnd && year >= seasonEnd.getFullYear() && month >= seasonEnd.getMonth()}>
                <span>»</span>
            </button>
        </div>
        <ul className={"weekdaysLong"}>
            {
                getWeekDayNames("long").map(weekday =>
                    <li key={weekday} className={"weekday"}>
                        <span>{weekday}</span>
                    </li>
                )
            }
        </ul>
        <ul className={"weekdaysShort"}>
            {
                getWeekDayNames("short").map(weekday =>
                    <li key={weekday} className={"weekday"}>
                        <span>{weekday}</span>
                    </li>
                )
            }
        </ul>
    </div>;
}

export default CalendarHeader;
