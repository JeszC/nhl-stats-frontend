function SortableHeader({text, title, sortedColumn, sortingFunction, sortingKey, sortingDirection, defaultHeader}) {

    return <th className={sortedColumn ? "selectedColumn" : ""}>
        {
            defaultHeader
            ? <button ref={defaultHeader}
                      type={"button"}
                      className={"transparentButton" + (sortedColumn ? " selectedColumnButton sortedColumn" : "")}
                      title={title}
                      onClick={event => sortingFunction(sortingKey, !sortingDirection, event.target)}>
                {text}<span></span>
            </button>
            : <button type={"button"}
                      className={"transparentButton" + (sortedColumn ? " selectedColumnButton sortedColumn" : "")}
                      title={title}
                      onClick={event => sortingFunction(sortingKey, !sortingDirection, event.target)}>
                {text}<span></span>
            </button>
        }
    </th>;
}

export default SortableHeader;
