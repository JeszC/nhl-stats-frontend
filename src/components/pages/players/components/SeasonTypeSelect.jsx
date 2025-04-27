function SeasonTypeSelect({showPlayoffs, setShowPlayoffs}) {

    return <>
        <h4>Season type</h4>
        <button type={"button"}
                title={"Show season"}
                hidden={!showPlayoffs}
                onClick={() => setShowPlayoffs(false)}>
            <span>Show season</span>
        </button>
        <button type={"button"}
                title={"Show playoffs"}
                hidden={showPlayoffs}
                onClick={() => setShowPlayoffs(true)}>
            <span>Show playoffs</span>
        </button>
    </>;
}

export default SeasonTypeSelect;
