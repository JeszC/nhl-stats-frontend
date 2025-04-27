import clinchIndicators from "../../../../data/clinchIndicators.json";
import LegendItems from "../../../shared/sidebar/components/LegendItems";

function Legend({teamStandings}) {

    return <details>
        <summary>Legend</summary>
        <dl className={"standingsLegend"} title={"Legend"}>
            <LegendItems data={clinchIndicators.columns}></LegendItems>
            <LegendItems data={teamStandings.columns}></LegendItems>
        </dl>
    </details>;
}

export default Legend;
