import {isGameUpcoming} from "../../../../../scripts/utils.js";
import DialogContent from "../../shared/DialogContent.jsx";
import GameInformation from "./body/gameInformation/GameInformation.jsx";
import PlayedGame from "./body/playedGames/PlayedGame.jsx";
import UpcomingGame from "./body/upcomingGames/UpcomingGame.jsx";
import Header from "./header/Header.jsx";

function GameContent({
                         selectedGame,
                         setPlayer,
                         setActiveView,
                         setPreviousView,
                         fetchState,
                         setFetchState,
                         closeDialog,
                         onBack,
                         errorMessage,
                         subErrors
                     }) {

    return <DialogContent fetchState={fetchState}
                          closeDialog={closeDialog}
                          onBack={onBack}
                          errorMessage={errorMessage}
                          subErrors={subErrors}
                          headerData={<Header game={selectedGame}></Header>}
                          bodyData={
                              <>
                                  {
                                      selectedGame && Object.keys(selectedGame).length > 0
                                      ? <>
                                          <GameInformation game={selectedGame}></GameInformation>
                                          {
                                              isGameUpcoming(selectedGame.gameState)
                                              ? <UpcomingGame game={selectedGame}
                                                              setPlayer={setPlayer}
                                                              setActiveView={setActiveView}
                                                              setPreviousView={setPreviousView}
                                                              setFetchState={setFetchState}>
                                              </UpcomingGame>
                                              : <PlayedGame game={selectedGame}
                                                            setPlayer={setPlayer}
                                                            setActiveView={setActiveView}
                                                            setPreviousView={setPreviousView}
                                                            setFetchState={setFetchState}>
                                              </PlayedGame>
                                          }
                                      </>
                                      : null
                                  }
                              </>
                          }>
    </DialogContent>;
}

export default GameContent;
