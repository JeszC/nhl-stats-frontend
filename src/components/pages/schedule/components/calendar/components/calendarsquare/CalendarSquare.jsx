import currentDayIndicator from "../../../../images/Pin.svg";
import Game from "./components/Game";

function CalendarSquare({date, selectedTeams, showScores, openDialog}) {

    function getDayType() {
        let dayType = "day";
        if (date.isThisMonth) {
            if (date.games.length > 0) {
                if (selectedTeams.length === 1 && date.games[0].homeTeam.abbrev === selectedTeams[0].teamAbbrev) {
                    dayType += ` ${date.games[0].homeTeam.abbrev}`;
                } else {
                    dayType += " default";
                }
            } else {
                dayType += " noGame";
            }
        } else {
            dayType += " notThisMonth";
        }
        return dayType;
    }

    return <li className={getDayType()}>
        <div className={"dateSquare"}>
            <div className={"dayHeader"}>
                <span className={"dateNumber"}>{date.date.getDate()}</span>
                {
                    date.games.length > 0 && (selectedTeams.length > 1 || date.games.length > 1)
                    ? <span className={"numberOfGamesInHeader"}>Games: {date.games.length}</span>
                    : null
                }
                {
                    new Date(date.date).toLocaleDateString() === new Date().toLocaleDateString()
                    ? <img className={"currentDayIndicator"} src={currentDayIndicator} alt={"Current day indicator"}/>
                    : <span className={"dateNumber"}></span>
                }
            </div>
            {
                date.games.length > 0
                ? selectedTeams.length > 1
                  ? <>
                      <span className={"numberOfGamesInContent"}>Games: {date.games.length}</span>
                      {
                          date.games.map(game =>
                              <Game key={game.id} game={game} openDialog={openDialog} showScores={showScores}></Game>
                          )
                      }
                  </>
                  : date.games.length > 1
                    ? <>
                        <span className={"numberOfGamesInContent"}>Games: {date.games.length}</span>
                        {
                            date.games.map(game =>
                                <Game key={game.id} game={game} openDialog={openDialog} showScores={showScores}></Game>
                            )
                        }
                    </>
                    : <>
                        {
                            date.games.map(game =>
                                <Game key={game.id} game={game} openDialog={openDialog} showScores={showScores}></Game>
                            )
                        }
                    </>
                : null
            }
        </div>
    </li>;
}

export default CalendarSquare;
