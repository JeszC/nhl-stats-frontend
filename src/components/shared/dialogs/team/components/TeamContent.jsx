import {useEffect, useState} from "react";
import recordFormats from "../../../../../data/recordFormats.json";
import {getSeasonID} from "../../../../../scripts/utils.js";
import DialogContent from "../../shared/DialogContent.jsx";
import Games from "./body/Games.jsx";
import Injuries from "./body/Injuries.jsx";
import TeamInformation from "./body/TeamInformation.jsx";
import TeamRoster from "./body/TeamRoster.jsx";
import TeamStatistics from "./body/TeamStatistics.jsx";
import Header from "./header/Header.jsx";

function TeamContent({
                         setGame,
                         setPlayer,
                         selectedTeam,
                         fetchState,
                         closeDialog,
                         setActiveView,
                         setFetchState,
                         errorMessage,
                         subErrors
                     }) {
    const [pastGames, setPastGames] = useState([]);
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [injuries, setInjuries] = useState([]);
    const maxGames = 12;

    function getRecordFormat(season) {
        let seasonStartYear = season.toString().slice(0, 4);
        if (seasonStartYear < 2005 && seasonStartYear >= 1999) {
            return recordFormats.winsLossesTiesOvertimelosses.record.nhlKey;
        } else if (seasonStartYear < 1999) {
            return recordFormats.winsLossesTies.record.nhlKey;
        }
        return recordFormats.winsLossesOvertimelosses.record.nhlKey;
    }

    function getLastTenFormat(season) {
        let seasonStartYear = season.toString().slice(0, 4);
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

    return <DialogContent fetchState={fetchState}
                          closeDialog={closeDialog}
                          errorMessage={errorMessage}
                          subErrors={subErrors}
                          headerData={<Header team={selectedTeam}></Header>}
                          bodyData={
                              <>
                                  {
                                      selectedTeam && Object.keys(selectedTeam).length > 0
                                      ? <>
                                          <TeamInformation selectedTeam={selectedTeam}
                                                           recordFormat={getRecordFormat(getSeasonID(selectedTeam))}
                                                           lastTenFormat={getLastTenFormat(getSeasonID(selectedTeam))}>
                                          </TeamInformation>
                                          <div className={"pastAndUpcomingGames"}>
                                              <Games games={upcomingGames.length > 0
                                                            ? pastGames.slice(-(maxGames / 2))
                                                            : pastGames}
                                                     setGame={setGame}
                                                     setFetchState={setFetchState}
                                                     setActiveView={setActiveView}
                                                     headerText={"Past games"}>
                                              </Games>
                                              <Games games={pastGames.length > 0
                                                            ? upcomingGames.slice(0, maxGames / 2)
                                                            : upcomingGames}
                                                     setGame={setGame}
                                                     setFetchState={setFetchState}
                                                     setActiveView={setActiveView}
                                                     headerText={"Upcoming games"}>
                                              </Games>
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
                                          <TeamStatistics team={selectedTeam}/>
                                      </>
                                      : null
                                  }
                              </>
                          }>
    </DialogContent>;
}

export default TeamContent;
