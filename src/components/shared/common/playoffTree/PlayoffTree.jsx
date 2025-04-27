import {Fragment} from "react";
import constants from "../../../../data/constants.json";
import PlayoffMatchup from "./components/PlayoffMatchup";

function PlayoffTree({playoffTree, fetchState, hasStickyTitle = false}) {

    return <div className={"playoffTree"}>
        {
            hasStickyTitle
            ? <div className={"homeHeader"}>
                <span>Playoff Tree</span>
            </div>
            : <h2 id={"playoffTree"}>Playoff tree</h2>
        }
        {
            fetchState === constants.fetchState.finished
            ? <>
                {
                    playoffTree.series
                    ? <div className={"horizontalFlex playoffRounds"}>
                        <PlayoffMatchup playoffSeries={[playoffTree.series[4],
                                                        playoffTree.series[5],
                                                        playoffTree.series[6],
                                                        playoffTree.series[7]]}>
                        </PlayoffMatchup>
                        <PlayoffMatchup playoffSeries={[playoffTree.series[10],
                                                        playoffTree.series[11]]}>
                        </PlayoffMatchup>
                        <PlayoffMatchup playoffSeries={[playoffTree.series[13]]}></PlayoffMatchup>
                        <PlayoffMatchup playoffSeries={[playoffTree.series[14]]} seed={"top"}></PlayoffMatchup>
                        <PlayoffMatchup playoffSeries={[playoffTree.series[14]]} seed={"bottom"}></PlayoffMatchup>
                        <PlayoffMatchup playoffSeries={[playoffTree.series[12]]}></PlayoffMatchup>
                        <PlayoffMatchup playoffSeries={[playoffTree.series[8],
                                                        playoffTree.series[9]]}>
                        </PlayoffMatchup>
                        <PlayoffMatchup playoffSeries={[playoffTree.series[0],
                                                        playoffTree.series[1],
                                                        playoffTree.series[2],
                                                        playoffTree.series[3]]}>
                        </PlayoffMatchup>
                    </div>
                    : null
                }
            </>
            : null
        }
    </div>;
}

export default PlayoffTree;
