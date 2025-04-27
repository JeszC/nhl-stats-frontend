import {getPlayerFullName, getPositionTitle, parseDecimals} from "../../../../../../../scripts/parsing.js";
import {getPlayer} from "../../../../../../../scripts/utils.js";

function Goalies({selectedTeam, goaliesSeason, goaliesPlayoffs, setPlayer, setFetchState, setActiveView}) {

    return <div className={"teamsPlayers"}>
        <div className={"teamsGrid"}>
            {
                goaliesSeason.map(goalieSeason =>
                    <button key={goalieSeason.playerId}
                            type={"button"}
                            className={"teamsButton"}
                            title={"Show player details"}
                            onClick={() => getPlayer(goalieSeason.playerId, setPlayer, setFetchState, setActiveView)}>
                        <div className={"verticalFlex teamsCard"}>
                            <div className={"horizontalFlex teamsPlayer"}>
                                <img className={`defaultImage teamsImage default
                                ${selectedTeam.franchiseInfo.at(-1).triCode} gradient`}
                                     src={goalieSeason.headshot}
                                     alt={getPlayerFullName(goalieSeason)}/>
                                <div className={"verticalFlex teamsInformation"}>
                                    <h3>{getPlayerFullName(goalieSeason)}</h3>
                                    <div className={"horizontalFlex numberAndPosition"}>
                                        {
                                            goalieSeason.number === undefined
                                            ? null
                                            : <span>#{goalieSeason.number.toLocaleString()}</span>
                                        }
                                        <span>{getPositionTitle("G")}</span>
                                    </div>
                                    <div className={"horizontalFlex numberAndPosition"}>
                                        <div className={"playersCountryOfBirth"}>
                                            <img src={goalieSeason.countryFlag}
                                                 alt={`${goalieSeason.birthCountry} flag`}
                                                 title={goalieSeason.birthCountry}/>
                                        </div>
                                        <span>
                                            {
                                                goalieSeason.ageAtSeasonStart === undefined
                                                ? null
                                                : `${Math.floor(goalieSeason.ageAtSeasonStart).toLocaleString()} y/o`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={"horizontalFlex teamsStatistics"}>
                                {
                                    goalieSeason.gamesPlayed === undefined
                                    ? null
                                    : <h4 className={"teamsStatIndicator"}>Season:</h4>
                                }
                                {
                                    goalieSeason.gamesPlayed === undefined
                                    ? null
                                    : <div className={"verticalFlex"}>
                                        <h4>Games</h4>
                                        <span>{goalieSeason.gamesPlayed.toLocaleString()}</span>
                                    </div>
                                }
                                {
                                    goalieSeason.savePercentage === undefined
                                    ? null
                                    : <div className={"verticalFlex"}>
                                        <h4>SV%</h4>
                                        <span>{parseDecimals(goalieSeason.savePercentage)}</span>
                                    </div>
                                }
                                {
                                    goalieSeason.goalsAgainstAverage === undefined
                                    ? null
                                    : <div className={"verticalFlex"}>
                                        <h4>GAA</h4>
                                        <span>{parseDecimals(goalieSeason.goalsAgainstAverage, 1)}</span>
                                    </div>
                                }
                                {
                                    goalieSeason.shutouts === undefined
                                    ? null
                                    : <div className={"verticalFlex"}>
                                        <h4>Shutouts</h4>
                                        <span>{goalieSeason.shutouts.toLocaleString()}</span>
                                    </div>
                                }
                            </div>
                            {
                                goaliesPlayoffs
                                ? goaliesPlayoffs.filter(goaliePlayoffs =>
                                    goalieSeason.playerId === goaliePlayoffs.playerId)
                                                 .map((goaliePlayoff, index) =>
                                                     <div key={`${goaliePlayoff.playerId} ${index.toString()}`}
                                                          className={"horizontalFlex teamsStatistics"}>
                                                         <h4 className={"teamsStatIndicator"}>Playoffs:</h4>
                                                         {
                                                             goaliePlayoff.gamesPlayed === undefined
                                                             ? null
                                                             : <div className={"verticalFlex"}>
                                                                 <h4>Games</h4>
                                                                 <span>
                                                                     {goaliePlayoff.gamesPlayed.toLocaleString()}
                                                                 </span>
                                                             </div>
                                                         }
                                                         {
                                                             goaliePlayoff.savePercentage === undefined
                                                             ? null
                                                             : <div className={"verticalFlex"}>
                                                                 <h4>SV%</h4>
                                                                 <span>
                                                                     {parseDecimals(goaliePlayoff.savePercentage)}
                                                                 </span>
                                                             </div>
                                                         }
                                                         {
                                                             goaliePlayoff.goalsAgainstAverage === undefined
                                                             ? null
                                                             : <div className={"verticalFlex"}>
                                                                 <h4>GAA</h4>
                                                                 <span>
                                                                     {
                                                                         parseDecimals(
                                                                             goaliePlayoff.goalsAgainstAverage, 1
                                                                         )
                                                                     }
                                                                 </span>
                                                             </div>
                                                         }
                                                         {
                                                             goaliePlayoff.shutouts === undefined
                                                             ? null
                                                             : <div className={"verticalFlex"}>
                                                                 <h4>Shutouts</h4>
                                                                 <span>{goaliePlayoff.shutouts.toLocaleString()}</span>
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

export default Goalies;
