import LegendItem from "./LegendItem";

function LegendItems({data}) {

    return <>
        {
            Object.keys(data).map((column, index) =>
                <LegendItem key={data[column].text + index.toString()}
                            legendKey={data[column].text}
                            legend={data[column].title}>
                </LegendItem>
            )
        }
    </>;
}

export default LegendItems;
