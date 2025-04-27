import {Fragment, useRef, useState} from "react";
import constants from "../../../../../data/constants.json";
import PlayoffDialog from "../../../dialogs/playoff/PlayoffDialog";
import TeamDialog from "../../../dialogs/team/TeamDialog";
import PlayoffTeam from "./PlayoffTeam";

function PlayoffMatchup({playoffSeries, seed}) {
    const [selectedTeam, setSelectedTeam] = useState({});
    const [selectedSeries, setSelectedSeries] = useState({});
    const [fetchState, setFetchState] = useState(constants.fetchState.loading);
    const playoffDialog = useRef(null);
    const teamDialog = useRef(null);

    async function openPlayoffSeriesDialog(series) {
        setSelectedSeries({});
        setFetchState(constants.fetchState.loading);
        let season = series.season;
        let seriesLetter = series.seriesLetter;
        if (season && seriesLetter) {
            playoffDialog.current.showModal();
            try {
                let response = await fetch(`${constants.baseURL}/playoffs/getPlayoffSeries/${season}/${seriesLetter}`);
                if (response.ok) {
                    let data = await response.json();
                    setSelectedSeries(data);
                    setFetchState(constants.fetchState.finished);
                } else {
                    setFetchState(constants.fetchState.error);
                }
            } catch (ignored) {
                setFetchState(constants.fetchState.error);
            }
        } else {
            setFetchState(constants.fetchState.finished);
        }
    }

    async function openTeamDialog(team) {
        setSelectedTeam({});
        setFetchState(constants.fetchState.loading);
        teamDialog.current.showModal();
        try {
            let response = await fetch(`${constants.baseURL}/teams/getTeam/${team}/${playoffSeries[0].season}`);
            if (response.ok) {
                setSelectedTeam(await response.json());
                setFetchState(constants.fetchState.finished);
            } else {
                setFetchState(constants.fetchState.error);
            }
        } catch (ignored) {
            setFetchState(constants.fetchState.error);
        }
    }

    return <div className={"verticalFlex playoffRound"}>
        {
            playoffSeries.map(series =>
                <div key={series.seriesAbbrev + series.seriesLetter} className={"verticalFlex playoffSeries"}>
                    <button className={"playoffDetails"}
                            title={"Show series details"}
                            onClick={() => openPlayoffSeriesDialog(series)}>
                        Series details
                    </button>
                    {
                        !seed && series.topSeedTeam?.conference === series.bottomSeedTeam?.conference
                        ? <>
                            <PlayoffTeam series={series}
                                         seed={series.topSeedTeam}
                                         seedName={"topSeed"}
                                         openDialog={openTeamDialog}>
                            </PlayoffTeam>
                            <PlayoffTeam series={series}
                                         seed={series.bottomSeedTeam}
                                         seedName={"bottomSeed"}
                                         openDialog={openTeamDialog}>
                            </PlayoffTeam>
                        </>
                        : seed === "top"
                          ? series.topSeedTeam.conference === "E" || series.topSeedTeam.conference === "XVE"
                            ? <PlayoffTeam series={series}
                                           seed={series.bottomSeedTeam}
                                           seedName={"bottomSeed"}
                                           openDialog={openTeamDialog}>
                            </PlayoffTeam>
                            : <PlayoffTeam series={series}
                                           seed={series.topSeedTeam}
                                           seedName={"topSeed"}
                                           openDialog={openTeamDialog}>
                            </PlayoffTeam>
                          : seed === "bottom"
                            ? series.topSeedTeam.conference === "E" || series.topSeedTeam.conference === "XVE"
                              ? <PlayoffTeam series={series}
                                             seed={series.topSeedTeam}
                                             seedName={"topSeed"}
                                             openDialog={openTeamDialog}>
                              </PlayoffTeam>
                              : <PlayoffTeam series={series}
                                             seed={series.bottomSeedTeam}
                                             seedName={"bottomSeed"}
                                             openDialog={openTeamDialog}>
                              </PlayoffTeam>
                            : null
                    }
                </div>
            )
        }
        <PlayoffDialog dialogReference={playoffDialog}
                       playoffSeries={selectedSeries}
                       fetchState={fetchState}
                       setFetchState={setFetchState}>
        </PlayoffDialog>
        <TeamDialog dialogReference={teamDialog}
                    selectedTeam={selectedTeam}
                    fetchState={fetchState}
                    setFetchState={setFetchState}>
        </TeamDialog>
    </div>;
}

export default PlayoffMatchup;
