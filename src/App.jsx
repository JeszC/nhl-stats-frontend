import "./stylesheets/App.css";
import "./stylesheets/dark.css";
import "./stylesheets/light.css";
import {useState} from "react";
import Navbar from "./components/navbar/Navbar";
import Draft from "./components/pages/draft/Draft";
import Home from "./components/pages/home/Home";
import Players from "./components/pages/players/Players";
import Results from "./components/pages/results/Results";
import Schedule from "./components/pages/schedule/Schedule";
import Standings from "./components/pages/standings/Standings";
import teamSchedulesIcon from "./components/shared/images/Calendar.svg";
import draftResultsIcon from "./components/shared/images/DraftResults.svg";
import gameResultsIcon from "./components/shared/images/GameResults.svg";
import homeIcon from "./components/shared/images/Home.svg";
import playerStandingsIcon from "./components/shared/images/PlayerStandings.svg";
import teamStandingsIcon from "./components/shared/images/TeamStandings.svg";

function App() {
    const [showOptions, setShowOptions] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const components = [
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
