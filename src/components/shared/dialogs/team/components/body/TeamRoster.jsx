import {useEffect, useState} from "react";
import teamRoster from "../../../../../../data/teamRoster.json";
import SingleSelectionButtons from "../../../../common/singleSelectionButtons/SingleSelectionButtons.jsx";
import Goalies from "./Goalies.jsx";
import Skaters from "./Skaters.jsx";

function TeamRoster({selectedTeam, setPlayer, setFetchState, setActiveView}) {
    const [upperCategory, setUpperCategory] = useState(null);
    const [lowerCategory, setLowerCategory] = useState(null);
    const nhl = teamRoster.upperCategories[0].value;
    const prospects = teamRoster.upperCategories[1].value;
    const goalies = teamRoster.lowerCategories[2].value;

    function setUpOnLoad() {
        for (let upperCategory of teamRoster.upperCategories) {
            if (upperCategory.default) {
                setUpperCategory(upperCategory.value);
            }
        }
        for (let lowerCategory of teamRoster.lowerCategories) {
            if (lowerCategory.default) {
                setLowerCategory(lowerCategory.value);
            }
        }
    }

    useEffect(setUpOnLoad, []);

    return <div className={"teamsContent teamsRoster"}>
        <h2 className={"teamsRosterHeader"}>Roster</h2>
        <div className={"teamsRosterTabs"}>
            <div className={"horizontalFlex tabs teamsTabs"}>
                <SingleSelectionButtons buttonData={teamRoster.upperCategories}
                                        setData={setUpperCategory}
                                        classes={"tab teamsTab"}>
                </SingleSelectionButtons>
            </div>
            <div className={"horizontalFlex tabs teamsTabs"}>
                <SingleSelectionButtons buttonData={teamRoster.lowerCategories}
                                        setData={setLowerCategory}
                                        classes={"tab teamsTab"}>
                </SingleSelectionButtons>
            </div>
        </div>
        {
            upperCategory === nhl
            ? lowerCategory === goalies
              ? <Goalies selectedTeam={selectedTeam}
                         goaliesSeason={selectedTeam.players.season[lowerCategory]}
                         goaliesPlayoffs={selectedTeam.players.playoffs[lowerCategory]}
                         setPlayer={setPlayer}
                         setFetchState={setFetchState}
                         setActiveView={setActiveView}>
              </Goalies>
              : <Skaters selectedTeam={selectedTeam}
                         skatersSeason={selectedTeam.players.season[lowerCategory]}
                         skatersPlayoffs={selectedTeam.players.playoffs[lowerCategory]}
                         setPlayer={setPlayer}
                         setFetchState={setFetchState}
                         setActiveView={setActiveView}>
              </Skaters>
            : upperCategory === prospects && Object.keys(selectedTeam.prospects).length > 0
              ? lowerCategory === goalies
                ? <Goalies selectedTeam={selectedTeam}
                           goaliesSeason={selectedTeam.prospects[lowerCategory]}
                           setPlayer={setPlayer}
                           setFetchState={setFetchState}
                           setActiveView={setActiveView}>
                </Goalies>
                : <Skaters selectedTeam={selectedTeam}
                           skatersSeason={selectedTeam.prospects[lowerCategory]}
                           setPlayer={setPlayer}
                           setFetchState={setFetchState}
                           setActiveView={setActiveView}>
                </Skaters>
              : null
        }
    </div>;
}

export default TeamRoster;
