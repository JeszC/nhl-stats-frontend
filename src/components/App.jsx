import "../stylesheets/App.css";
import "../stylesheets/dark.css";
import "../stylesheets/light.css";
import {useState} from "react";
import Navbar from "./navbar/Navbar.jsx";
import SeasonAwards from "./pages/awards/SeasonAwards.jsx";
import Draft from "./pages/draft/Draft.jsx";
import Home from "./pages/home/Home.jsx";
import Players from "./pages/players/Players.jsx";
import Results from "./pages/results/Results.jsx";
import Schedule from "./pages/schedule/Schedule.jsx";
import Standings from "./pages/standings/Standings.jsx";
import teamSchedulesIcon from "./shared/images/Calendar.svg";
import draftResultsIcon from "./shared/images/DraftResults.svg";
import gameResultsIcon from "./shared/images/GameResults.svg";
import homeIcon from "./shared/images/Home.svg";
import playerStandingsIcon from "./shared/images/PlayerStandings.svg";
import teamStandingsIcon from "./shared/images/TeamStandings.svg";

function App() {
    const [showOptions, setShowOptions] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const components = [
        {
            component: <SeasonAwards showOptions={showOptions}
                                     setShowOptions={setShowOptions}
                                     showHelp={showHelp}>
            </SeasonAwards>,
            linkText: "Season Awards",
            linkURL: "/awards",
            icon: draftResultsIcon
        },
        {
            component: <Schedule showOptions={showOptions}
                                 setShowOptions={setShowOptions}
                                 showHelp={showHelp}>
            </Schedule>,
            linkText: "Team Schedules",
            linkURL: "/schedules",
            icon: teamSchedulesIcon
        },
        {
            component: <Results showOptions={showOptions}
                                setShowOptions={setShowOptions}
                                showHelp={showHelp}>
            </Results>,
            linkText: "Game Results",
            linkURL: "/results",
            icon: gameResultsIcon
        },
        {
            component: <Home showOptions={showOptions} setShowOptions={setShowOptions} showHelp={showHelp}></Home>,
            linkText: "Home",
            linkURL: "/",
            icon: homeIcon
        },
        {
            component: <Standings showOptions={showOptions}
                                  setShowOptions={setShowOptions}
                                  showHelp={showHelp}>
            </Standings>,
            linkText: "Team Standings",
            linkURL: "/teams",
            icon: teamStandingsIcon
        },
        {
            component: <Players showOptions={showOptions}
                                setShowOptions={setShowOptions}
                                showHelp={showHelp}>
            </Players>,
            linkText: "Player Standings",
            linkURL: "/players",
            icon: playerStandingsIcon
        },
        {
            component: <Draft showOptions={showOptions}
                              setShowOptions={setShowOptions}
                              showHelp={showHelp}>
            </Draft>,
            linkText: "Draft Results",
            linkURL: "/draft",
            icon: draftResultsIcon
        }
    ];

    return <Navbar components={components}
                   showOptions={showOptions}
                   setShowOptions={setShowOptions}
                   showHelp={showHelp}
                   setShowHelp={setShowHelp}>
    </Navbar>;
}

export default App;
