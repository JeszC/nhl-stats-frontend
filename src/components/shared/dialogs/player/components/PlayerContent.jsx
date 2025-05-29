import DialogContent from "../../shared/DialogContent.jsx";
import Awards from "./body/Awards.jsx";
import Biography from "./body/Biography.jsx";
import CareerStatistics from "./body/CareerStatistics.jsx";
import LastFiveGames from "./body/LastFiveGames.jsx";
import PlayerInformation from "./body/PlayerInformation.jsx";
import SeasonHistory from "./body/SeasonHistory.jsx";
import Header from "./header/Header.jsx";

function PlayerContent({selectedPlayer, fetchState, closeDialog, onBack}) {

    return <>
        <DialogContent fetchState={fetchState}
                       closeDialog={closeDialog}
                       onBack={onBack}
                       headerData={<Header player={selectedPlayer}></Header>}
                       bodyData={
                           <>
                               {
                                   selectedPlayer && Object.keys(selectedPlayer).length > 0
                                   ? <>
                                       <PlayerInformation player={selectedPlayer}></PlayerInformation>
                                       <CareerStatistics player={selectedPlayer}></CareerStatistics>
                                       <Awards player={selectedPlayer}></Awards>
                                       <Biography player={selectedPlayer}></Biography>
                                       <LastFiveGames player={selectedPlayer}></LastFiveGames>
                                       <SeasonHistory player={selectedPlayer}></SeasonHistory>
                                   </>
                                   : null
                               }
                           </>
                       }>
        </DialogContent>
    </>;
}

export default PlayerContent;
