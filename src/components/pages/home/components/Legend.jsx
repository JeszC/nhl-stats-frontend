import homeCategories from "../../../../data/home.json";
import LegendItems from "../../../shared/sidebar/components/LegendItems.jsx";

function Legend() {

    return <details>
        <summary>Legend</summary>
        <dl className={"draftLegend"} title={"Legend"}>
            <LegendItems data={homeCategories.lowerCategoriesSkater}></LegendItems>
            <LegendItems data={homeCategories.lowerCategoriesGoalie}></LegendItems>
        </dl>
    </details>;
}

export default Legend;
