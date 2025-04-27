import {getPlayerFullName} from "../../../../../../../../../scripts/parsing.js";
import {getPlayer} from "../../../../../../../../../scripts/utils.js";

function Scratches({game, setPlayer, setActiveView, setPreviousView, setFetchState}) {

    return <details className={"gamesContent"} open>
        <summary className={"gamesTitle"}>Scratches</summary>
        <div className={"teamSeparatedInformation"}>
            <div className={"periodInformation"}>
                {
                    game.summary.gameInfo.awayTeam.scratches.map(scratch =>
                        <div key={scratch.id} className={"horizontalFlex playerInformation"}>
                            <button type={"button"}
                                    className={"textOnlyButton imageButton"}
                                    title={"Show player details"}
                                    onClick={() =>
                                        getPlayer(scratch.id,
                                            setPlayer,
                                            setFetchState,
                                            setActiveView,
                                            setPreviousView)}>
                                <img className={`defaultImage gamesImage zoom default ${game.awayTeam.abbrev} gradient`}
                                     src={scratch.headshot}
                                     alt={`${getPlayerFullName(scratch)} headshot`}/>
                            </button>
                            <div className={"verticalFlex"}>
                                <button type={"button"}
                                        className={"textOnlyButton primary"}
                                        title={"Show player details"}
                                        onClick={() =>
                                            getPlayer(scratch.id,
                                                setPlayer,
                                                setFetchState,
                                                setActiveView,
                                                setPreviousView)}>
                                    {getPlayerFullName(scratch)}
                                </button>
                                <div className={"horizontalFlex stats scratchStats"}>
                                    <span className={"scratchSingleStat"}>{game.awayTeam.abbrev}</span>
                                    {
                                        scratch.positionCode
                                        ? <span className={"scratchSingleStat"}>{scratch.positionCode}</span>
                                        : null
                                    }
                                    {
                                        scratch.sweaterNumber
                                        ? <span className={"scratchSingleStat"}>
                                            #{scratch.sweaterNumber.toLocaleString()}
                                        </span>
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className={"periodInformation"}>
                {
                    game.summary.gameInfo.homeTeam.scratches.map(scratch =>
                        <div key={scratch.id} className={"horizontalFlex playerInformation"}>
                            <button type={"button"}
                                    className={"textOnlyButton imageButton"}
                                    title={"Show player details"}
                                    onClick={() =>
                                        getPlayer(scratch.id,
                                            setPlayer,
                                            setFetchState,
                                            setActiveView,
                                            setPreviousView)}>
                                <img className={`defaultImage gamesImage zoom default ${game.homeTeam.abbrev} gradient`}
                                     src={scratch.headshot}
                                     alt={`${getPlayerFullName(scratch)} headshot`}/>
                            </button>
                            <div className={"verticalFlex"}>
                                <button type={"button"}
                                        className={"textOnlyButton primary"}
                                        title={"Show player details"}
                                        onClick={() =>
                                            getPlayer(scratch.id,
                                                setPlayer,
                                                setFetchState,
                                                setActiveView,
                                                setPreviousView)}>
                                    {getPlayerFullName(scratch)}
                                </button>
                                <div className={"horizontalFlex stats scratchStats"}>
                                    <span className={"scratchSingleStat"}>{game.homeTeam.abbrev}</span>
                                    {
                                        scratch.positionCode
                                        ? <span className={"scratchSingleStat"}>{scratch.positionCode}</span>
                                        : null
                                    }
                                    {
                                        scratch.sweaterNumber
                                        ? <span className={"scratchSingleStat"}>
                                            #{scratch.sweaterNumber.toLocaleString()}
                                        </span>
                                        : null
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    </details>;
}

export default Scratches;
