import {useEffect, useState} from "react";
import constants from "../../../../../../data/constants.json";
import Slider from "../../../../animations/slider/Slider";
import ErrorDialog from "../../../../errors/ErrorDialog";
import BackButtonIcon from "../../../../images/Back.svg";
import CloseButtonIcon from "../../../../images/Close.svg";
import Games from "./components/Games.jsx";
import Injuries from "./components/Injuries.jsx";
import TeamInformation from "./components/TeamInformation";
import TeamRoster from "./components/TeamRoster";
import recordFormats from "../../../../../../data/recordFormats.json";
import {getValue} from "../../../../../../scripts/utils.js";
import {getSeasonWithSeparator} from "../../../../../../scripts/parsing.js";

function TeamContent({setGame, setPlayer, selectedTeam, fetchState, closeDialog, setActiveView, setFetchState}) {
    const [pastGames, setPastGames] = useState([]);
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [injuries, setInjuries] = useState([]);
    const maxGames = 12;

    async function getGame(gameID) {
        setFetchState(constants.fetchState.loading);
        setActiveView("game");
        try {
            let response = await fetch(`${constants.baseURL}/schedule/getGame/${gameID}`);
            if (response.ok) {
                setGame(await response.json());
                setFetchState(constants.fetchState.finished);
            } else {
                setFetchState(constants.fetchState.error);
            }
        } catch (ignored) {
            setFetchState(constants.fetchState.error);
        }
    }

    function getRecordFormat(season) {
        let seasonStartYear = season.slice(0, 4);
        if (seasonStartYear < 2005 && seasonStartYear >= 1999) {
            return recordFormats.winsLossesTiesOvertimelosses.record.nhlKey;
        } else if (seasonStartYear < 1999) {
            return recordFormats.winsLossesTies.record.nhlKey;
        }
        return recordFormats.winsLossesOvertimelosses.record.nhlKey;
    }

    function getLastTenFormat(season) {
        let seasonStartYear = season.slice(0, 4);
        if (seasonStartYear < 2005 && seasonStartYear >= 1999) {
            return recordFormats.winsLossesTiesOvertimelosses.lastTen.nhlKey;
        } else if (seasonStartYear < 1999) {
            return recordFormats.winsLossesTies.lastTen.nhlKey;
        }
        return recordFormats.winsLossesOvertimelosses.lastTen.nhlKey;
    }

    function setTeamGames() {
        if (selectedTeam.schedule) {
            setPastGames(selectedTeam.schedule
                                     .filter(game => new Date(game.startTimeUTC) < new Date())
                                     .reverse()
                                     .slice(0, maxGames)
                                     .reverse());
            setUpcomingGames(selectedTeam.schedule
                                         .filter(game => new Date(game.startTimeUTC) > new Date())
                                         .slice(0, maxGames));
        }
    }

    useEffect(() => {
        setInjuries([]);
        let injuryData = selectedTeam?.injuries?.playerInjuries;
        if (injuryData) {
            for (let player of injuryData) {
                player.teamAbbrev = selectedTeam.franchiseInfo[0].triCode;
            }
            setInjuries(injuryData);
        }
    }, [selectedTeam]);

    useEffect(setTeamGames, [selectedTeam.schedule]);

    return <>
        <div className={"horizontalFlex gamesSummary"}>
            <button type={"button"}
                    className={"transparentButton dialogLeftElement"}
                    title={"Back"}
                    disabled={true}>
                <img className={"icon"} src={BackButtonIcon} alt={"Back button icon"}/>
            </button>
            {
                fetchState === constants.fetchState.loading
                ? <span>Loading...</span>
                : fetchState === constants.fetchState.error
                  ? <span>Error loading team information.</span>
                  : Object.keys(selectedTeam).length > 0
                    ? <>
                        {
                            selectedTeam.teamStats.teamLogo
                            ? <img className={`defaultImage headerImage default
                            ${selectedTeam.franchiseInfo.at(-1).triCode} gradient`}
                                   src={selectedTeam.teamStats.teamLogo}
                                   alt={`${selectedTeam.franchiseInfo.at(-1).triCode} logo`}/>
                            : null
                        }
                        <div className={"verticalFlex"}>
                            <span>
                                {getValue(["teamName"], selectedTeam.franchiseInfo.at(-1), false, "Unknown team")}
                            </span>
                            <span>{getSeasonWithSeparator(selectedTeam.schedule[0].season.toString())}</span>
                        </div>
                    </>
                    : null
            }
            <button type={"button"}
                    className={"transparentButton dialogRightElement"}
                    title={"Close"}
                    onClick={closeDialog}>
                <img className={"icon"} src={CloseButtonIcon} alt={"Close button icon"}/>
            </button>
        </div>
        {
            fetchState === constants.fetchState.loading
            ? <Slider></Slider>
            : fetchState === constants.fetchState.error
              ? <ErrorDialog errorMessage={"Couldn't load team information. Server might be offline."}></ErrorDialog>
              : Object.keys(selectedTeam).length > 0
                ? <>
                    <TeamInformation selectedTeam={selectedTeam}
                                     recordFormat={getRecordFormat(selectedTeam.schedule[0].season.toString())}
                                     lastTenFormat={getLastTenFormat(selectedTeam.schedule[0].season.toString())}
                    ></TeamInformation>
                    <div className={"pastAndUpcomingGames"}>
                        {
                            upcomingGames.length > 0
                            ? <Games games={pastGames.slice(-(maxGames / 2))}
                                     getGame={getGame}
                                     headerText={"Past games"}>
                            </Games>
                            : <Games games={pastGames} getGame={getGame} headerText={"Past games"}></Games>
                        }
                        {
                            pastGames.length > 0
                            ? <Games games={upcomingGames.slice(0, maxGames / 2)}
                                     getGame={getGame}
                                     headerText={"Upcoming games"}>
                            </Games>
                            : <Games games={upcomingGames} getGame={getGame} headerText={"Upcoming games"}></Games>
                        }
                    </div>
                    {
                        injuries && injuries.length > 0
                        ? <Injuries injuries={injuries}
                                    teamLogo={selectedTeam?.teamStats?.teamLogo}
                                    setPlayer={setPlayer}
                                    setFetchState={setFetchState}
                                    setActiveView={setActiveView}>
                        </Injuries>
                        : null
                    }
                    <TeamRoster selectedTeam={selectedTeam}
                                setPlayer={setPlayer}
                                setFetchState={setFetchState}
                                setActiveView={setActiveView}>
                    </TeamRoster>
                </>
                : null
        }
    </>;
}

export default TeamContent;
