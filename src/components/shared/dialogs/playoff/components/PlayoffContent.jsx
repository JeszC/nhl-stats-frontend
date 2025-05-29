import DialogContent from "../../shared/DialogContent.jsx";
import Games from "./body/Games.jsx";
import Header from "./header/Header.jsx";
import SeriesInformation from "./body/SeriesInformation.jsx";

function PlayoffContent({setGame, selectedSeries, fetchState, setFetchState, closeDialog, setActiveView}) {

    return <DialogContent fetchState={fetchState}
                          closeDialog={closeDialog}
                          headerData={<Header series={selectedSeries}></Header>}
                          bodyData={
                              <>
                                  <SeriesInformation series={selectedSeries}></SeriesInformation>
                                  <Games series={selectedSeries}
                                         setGame={setGame}
                                         setFetchState={setFetchState}
                                         setActiveView={setActiveView}>
                                  </Games>
                              </>
                          }>
    </DialogContent>;
}

export default PlayoffContent;
