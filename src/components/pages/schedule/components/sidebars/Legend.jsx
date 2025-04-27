import schedule from "../../../../../data/schedule.json";
import LegendItem from "../../../../shared/sidebar/components/LegendItem";
import LegendItems from "../../../../shared/sidebar/components/LegendItems";
import currentDayIndicator from "../../images/Pin.svg";

function Legend({showTable}) {

    return <>
        <details>
            <summary>Legend</summary>
            {
                showTable
                ? <dl className={"scheduleTableLegend"} title={"Legend"}>
                    <LegendItems data={schedule.columns}></LegendItems>
                </dl>
                : <dl className={"scheduleCalendarLegend"} title={"Legend"}>
                    <LegendItem legendKey={"‹"} legend={"Previous month"} extraClass={"chevron"}></LegendItem>
                    <LegendItem legendKey={"›"} legend={"Next month"} extraClass={"chevron"}></LegendItem>
                    <LegendItem legendKey={"«"} legend={"Season start"} extraClass={"chevron"}></LegendItem>
                    <LegendItem legendKey={"»"} legend={"Season end"} extraClass={"chevron"}></LegendItem>
                    <LegendItem legendKey={<img className={"currentDayIndicator"}
                                                src={currentDayIndicator}
                                                alt={"Current day indicator"}/>}
                                legend={"Current day"}>
                    </LegendItem>
                </dl>
            }
        </details>
    </>;
}

export default Legend;
