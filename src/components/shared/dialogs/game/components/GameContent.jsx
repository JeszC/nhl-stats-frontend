import {isGameUpcoming} from "../../../../../scripts/utils.js";
import DialogContent from "../../shared/DialogContent.jsx";
import GameInformation from "./body/gameInformation/GameInformation.jsx";
import PlayedGames from "./body/playedGames/PlayedGames.jsx";
import UpcomingGames from "./body/upcomingGames/UpcomingGames.jsx";
import Header from "./header/Header.jsx";

function GameContent({
                         selectedGame,
                         setPlayer,
                         setActiveView,
                         setPreviousView,
                         fetchState,
                         setFetchState,
                         closeDialog,
                         onBack
                     }) {

    return <>
        <DialogContent fetchState={fetchState}
                       closeDialog={closeDialog}
                       onBack={onBack}
                       headerData={<Header game={selectedGame}></Header>}
                       bodyData={
                     <>
                         {
                             selectedGame && Object.keys(selectedGame).length > 0
                             ? <>
                                 <GameInformation game={selectedGame}></GameInformation>
                                 {
                                     isGameUpcoming(selectedGame.gameState)
                                     ? <UpcomingGames game={selectedGame}
                                                      setPlayer={setPlayer}
                                                      setActiveView={setActiveView}
                                                      setPreviousView={setPreviousView}
                                                      setFetchState={setFetchState}>
                                     </UpcomingGames>
                                     : <>
                                         <PlayedGames game={selectedGame}
                                                      setPlayer={setPlayer}
                                                      setActiveView={setActiveView}
                                                      setPreviousView={setPreviousView}
                                                      setFetchState={setFetchState}>
                                         </PlayedGames>
                                     </>
                                 }
                             </>
                             : null
                         }
                     </>
                 }>
        </DialogContent>
    </>;
}

export default GameContent;
