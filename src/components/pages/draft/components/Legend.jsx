import draft from "../../../../data/draft.json";
import LegendItems from "../../../shared/sidebar/components/LegendItems";

function Legend() {

    return <details>
        <summary>Legend</summary>
        <dl className={"draftLegend"} title={"Legend"}>
            <LegendItems data={draft.columns}></LegendItems>
        </dl>
    </details>;
}

export default Legend;
