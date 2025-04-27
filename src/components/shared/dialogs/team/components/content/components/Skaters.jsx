import {getPlayerFullName, getPositionTitle} from "../../../../../../../scripts/parsing.js";
import {getPlayer} from "../../../../../../../scripts/utils.js";

function Skaters({selectedTeam, skatersSeason, skatersPlayoffs, setPlayer, setFetchState, setActiveView}) {

    return <div className={"teamsPlayers"}>
        <div className={"teamsGrid"}>
            {
                skatersSeason.map(skaterSeason =>
                    <button key={skaterSeason.playerId}
                            type={"button"}
                            className={"teamsButton"}
                            title={"Show player details"}
                            onClick={() => getPlayer(skaterSeason.playerId, setPlayer, setFetchState, setActiveView)}>
                        <div className={"verticalFlex teamsCard"}>
                            <div className={"horizontalFlex teamsPlayer"}>
                                <img className={`defaultImage teamsImage default
                                ${selectedTeam.franchiseInfo.at(-1).triCode} gradient`}
                                     src={skaterSeason.headshot}
                                     alt={getPlayerFullName(skaterSeason)}/>
                                <div className={"verticalFlex teamsInformation"}>
                                    <h3>{getPlayerFullName(skaterSeason)}</h3>
                                    <div className={"horizontalFlex numberAndPosition"}>
                                        {
                                            skaterSeason.number === undefined
                                            ? null
                                            : <span>#{skaterSeason.number.toLocaleString()}</span>
                                        }
                                        {
                                            skaterSeason.positionCode === undefined
                                            ? null
                                            : <span>{getPositionTitle(skaterSeason.positionCode)}</span>
                                        }
                                    </div>
                                    <div className={"horizontalFlex numberAndPosition"}>
                                        <div className={"playersCountryOfBirth"}>
                                            <img src={skaterSeason.countryFlag}
                                                 alt={`${skaterSeason.birthCountry} flag`}
                                                 title={skaterSeason.birthCountry}/>
                                        </div>
                                        <span>
                                            {
                                                skaterSeason.ageAtSeasonStart === undefined
                                                ? null
                                                : `${Math.floor(skaterSeason.ageAtSeasonStart).toLocaleString()} y/o`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={"horizontalFlex teamsStatistics"}>
                                {
                                    skaterSeason.gamesPlayed === undefined
                                    ? null
                                    : <h4 className={"teamsStatIndicator"}>Season:</h4>
                                }
                                {
                                    skaterSeason.gamesPlayed === undefined
                                    ? null
                                    : <div className={"verticalFlex"}>
                                        <h4>Games</h4>
                                        <span>{skaterSeason.gamesPlayed.toLocaleString()}</span>
                                    </div>
                                }
                                {
                                    skaterSeason.points === undefined
                                    ? null
                                    : <div className={"verticalFlex"}>
                                        <h4>Points</h4>
                                        <span>{skaterSeason.points.toLocaleString()}</span>
                                    </div>
                                }
                                {
                                    skaterSeason.goals === undefined
                                    ? null
                                    : <div className={"verticalFlex"}>
                                        <h4>Goals</h4>
                                        <span>{skaterSeason.goals.toLocaleString()}</span>
                                    </div>
                                }
                                {
                                    skaterSeason.assists === undefined
                                    ? null
                                    : <div className={"verticalFlex"}>
                                        <h4>Assists</h4>
                                        <span>{skaterSeason.assists.toLocaleString()}</span>
                                    </div>
                                }
                            </div>
                            {
                                skatersPlayoffs
                                ? skatersPlayoffs.filter(skaterPlayoffs =>
                                    skaterSeason.playerId === skaterPlayoffs.playerId)
                                                 .map((skaterPlayoff, index) =>
                                                     <div key={`${skaterPlayoff.playerId} ${index.toString()}`}
                                                          className={"horizontalFlex teamsStatistics"}>
                                                         <h4 className={"teamsStatIndicator"}>Playoffs:</h4>
                                                         {
                                                             skaterPlayoff.gamesPlayed === undefined
                                                             ? null
                                                             : <div className={"verticalFlex"}>
                                                                 <h4>Games</h4>
                                                                 <span>
                                                                     {skaterPlayoff.gamesPlayed.toLocaleString()}
                                                                 </span>
                                                             </div>
                                                         }
                                                         {
                                                             skaterPlayoff.points === undefined
                                                             ? null
                                                             : <div className={"verticalFlex"}>
                                                                 <h4>Points</h4>
                                                                 <span>{skaterPlayoff.points.toLocaleString()}</span>
                                                             </div>
                                                         }
                                                         {
                                                             skaterPlayoff.goals === undefined
                                                             ? null
                                                             : <div className={"verticalFlex"}>
                                                                 <h4>Goals</h4>
                                                                 <span>{skaterPlayoff.goals.toLocaleString()}</span>
                                                             </div>
                                                         }
                                                         {
                                                             skaterPlayoff.assists === undefined
                                                             ? null
                                                             : <div className={"verticalFlex"}>
                                                                 <h4>Assists</h4>
                                                                 <span>{skaterPlayoff.assists.toLocaleString()}</span>
                                                             </div>
                                                         }
                                                     </div>
                                                 )
                                : null
                            }
                        </div>
                    </button>
                )
            }
        </div>
    </div>;
}

export default Skaters;
