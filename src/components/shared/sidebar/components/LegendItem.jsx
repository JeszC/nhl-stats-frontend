function LegendItem({legendKey, legend, extraClass}) {

    return <div className={"horizontalFlex legend"}>
        <dt className={extraClass ? `legendKey ${extraClass}` : "legendKey"}>{legendKey}</dt>
        <dd>{legend}</dd>
    </div>;
}

export default LegendItem;
