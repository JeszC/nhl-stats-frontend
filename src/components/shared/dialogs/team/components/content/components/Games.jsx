import GameBox from "../../../../../common/gameBox/GameBox.jsx";

function Games({games, getGame, headerText = "Games"}) {

    return games.length > 0
           ? <div className={"teamsContent"}>
               <h2>{headerText}</h2>
               <div className={"todayGames"}>
                   {
                       games.map(game =>
                           <GameBox key={game.id} game={game} onClick={getGame} isScorable={true}></GameBox>
                       )
                   }
               </div>
           </div>
           : null;
}

export default Games;
