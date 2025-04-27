import calendarIndicator from "../../../../shared/images/Calendar.svg";
import tableIndicator from "../../images/Table.svg";

function FormatSelect({showTable, setShowTable, localStorageKey}) {

    function showTableView() {
        setShowTable(true);
        localStorage.setItem(localStorageKey, true.toString());
    }

    function showCalendarView() {
        setShowTable(false);
        localStorage.setItem(localStorageKey, false.toString());
    }

    return <>
        <h4>Schedule format</h4>
        <button type={"button"}
                className={"buttonWithIcon"}
                title={"Show table"}
                hidden={showTable}
                onClick={showTableView}>
            <span>Show table</span>
            <img className={"buttonIndicator"} src={tableIndicator} alt={"Table indicator"}/>
        </button>
        <button type={"button"}
                className={"buttonWithIcon"}
                title={"Show calendar"}
                hidden={!showTable}
                onClick={showCalendarView}>
            <span>Show calendar</span>
            <img className={"buttonIndicator"} src={calendarIndicator} alt={"Calendar indicator"}/>
        </button>
    </>;
}

export default FormatSelect;
