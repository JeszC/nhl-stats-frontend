import SortableHeader from "./SortableHeader";

function TableHeader({data, sortedColumn, sortingFunction, sortingDirection, defaultHeader, defaultColumn}) {

    return <>
        {
            Object.keys(data.columns).map((column, index) =>
                <SortableHeader key={data.columns[column].text + data.columns[column].title + index.toString()}
                                text={data.columns[column].text}
                                title={data.columns[column].title}
                                sortedColumn={index === sortedColumn}
                                sortingFunction={sortingFunction}
                                sortingDirection={sortingDirection}
                                sortingKey={data.columns[column]}
                                defaultHeader={data.columns[column] === defaultColumn ? defaultHeader : undefined}>
                </SortableHeader>
            )
        }
    </>;
}

export default TableHeader;
