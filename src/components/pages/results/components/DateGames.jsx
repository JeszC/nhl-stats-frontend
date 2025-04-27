import GameBox from "../../../shared/common/gameBox/GameBox.jsx";

function DateGames({date, openDialog}) {

    function isToday() {
        return new Date(date.date).getDate() === new Date().getDate() ? "today" : "";
    }

    return <details className={"dayResults"}>
        <summary className={`horizontalFlex gamesSummary resultSummary ${isToday()}`}>
            <div className={"verticalFlex dateAndNumberOfGames"}>
                <span>
                    {
                        new Date(date.date).toLocaleDateString([], {
                            weekday: "long",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        })
                    }
                </span>
                <span className={"numberOfGamesInOneDay"}>Games: {date.games.length}</span>
            </div>
        </summary>
        <div className={"todayGames"}>
            {
                date.games.map(game =>
                    <GameBox key={game.id}
                             game={game}
                             onClick={openDialog}
                             gameDate={new Date(game.startTimeUTC).toLocaleString([], {
                                 hour: "2-digit",
                                 minute: "2-digit"
                             })}
                             isScorable={true}>
                    </GameBox>
                )
            }
        </div>
    </details>;
}

export default DateGames;
