import goalieStandings from "../../../../data/goalieStandings.json";
import skaterStandings from "../../../../data/skaterStandings.json";
import LegendItems from "../../../shared/sidebar/components/LegendItems";

function Legend({showGoalies}) {

    return <details>
        <summary>Legend</summary>
        {
            <dl className={"playersLegend"} title={"Legend"}>
                {
                    showGoalies
                    ? <LegendItems data={goalieStandings.columns}></LegendItems>
                    : <LegendItems data={skaterStandings.columns}></LegendItems>
                }
            </dl>
        }
    </details>;
}

export default Legend;
