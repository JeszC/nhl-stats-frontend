import {useEffect, useRef, useState} from "react";
import constants from "../../../../data/constants.json";
import homeCategories from "../../../../data/home.json";
import {getOrdinalNumber} from "../../../../scripts/parsing.js";
import SingleSelectionButtons from "../../../shared/common/singleSelectionButtons/SingleSelectionButtons";
import TeamDialog from "../../../shared/dialogs/team/TeamDialog";

function TopTeams({teams}) {
    const [topTeams, setTopTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState({});
    const [fetchState, setFetchState] = useState(constants.fetchState.finished);
    const dialog = useRef(null);

    function getFilterCategories() {
        let data = [];
        for (let teamCategory of Object.keys(homeCategories.teamCategories)) {
            let category = {
                default: homeCategories.teamCategories[teamCategory].default,
                value: homeCategories.teamCategories[teamCategory].nhlKey,
                text: homeCategories.teamCategories[teamCategory].text,
                title: homeCategories.teamCategories[teamCategory].title
            };
            data.push(category);
        }
        return data;
    }

    async function getLatestSeason() {
        let latestSeasonResponse = await fetch(`${constants.baseURL}/home/getLatestSeason`);
        if (latestSeasonResponse.ok) {
            return await latestSeasonResponse.json();
        }
        throw new Error("HTTP error when fetching latest season.");
    }

    async function openDialogKeyboard(event, team) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            await openDialog(team);
        }
    }

    async function openDialog(team) {
        setSelectedTeam({});
        if (team) {
            setFetchState(constants.fetchState.loading);
            dialog.current.showModal();
            try {
                let latestSeason = await getLatestSeason();
                let response = await fetch(`${constants.baseURL}/teams/getTeam/${team.teamAbbrev.default}/${latestSeason}`);
                if (response.ok) {
                    setSelectedTeam(await response.json());
                    setFetchState(constants.fetchState.finished);
                } else {
                    setFetchState(constants.fetchState.error);
                }
            } catch (ignored) {
                setFetchState(constants.fetchState.error);
            }
        }
    }

    function filterTeams(conference) {
        if (conference) {
            setTopTeams(teams.filter(team => team.conferenceAbbrev === conference).slice(0, 10));
        } else {
            setTopTeams(teams.slice(0, 10));
        }
    }

    function setUpOnLoad() {
        setTopTeams(teams.slice(0, 10));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(setUpOnLoad, []);

    return <div>
        <h2 id={"topTeams"}>Top teams</h2>
        <div className={"verticalFlex tableAndTabs"}>
            <div className={"horizontalFlex tabs homeTabs teamTabs"}>
                <SingleSelectionButtons buttonData={getFilterCategories()}
                                        setData={filterTeams}
                                        classes={"tab homeTab"}
                                        selectionClasses={["activeTab"]}>
                </SingleSelectionButtons>
            </div>
            <table className={"homeTable tableAlternateRows"} aria-label={"Top teams table"}>
                <thead>
                    <tr>
                        <th title={"Number"}>#</th>
                        <th title={"Team"}>TEAM</th>
                        <th title={"Points"}>P</th>
                        <th title={"Record (W-L-OTL)"}>REC</th>
                        <th title={"Last ten games (W-L-OTL)"}>L10</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        topTeams.map((team, index) =>
                            <tr key={team.teamAbbrev.default}
                                role={"button"}
                                tabIndex={0}
                                onClick={() => openDialog(team)}
                                onKeyDown={event => openDialogKeyboard(event, team)}>
                                <td>{getOrdinalNumber(index + 1)}</td>
                                <td className={"horizontalFlex teamLogoAndName"}>
                                    <img className={`defaultImage default ${team.teamAbbrev.default} gradient`}
                                         src={team.teamLogo}
                                         alt={`${team.teamAbbrev.default} logo`}/>
                                    <span>{team.teamName.default}</span>
                                </td>
                                <td>{team.points.toLocaleString()}</td>
                                <td>
                                    {team.wins.toLocaleString()}
                                    -{team.losses.toLocaleString()}
                                    -{team.otLosses.toLocaleString()}
                                </td>
                                <td>
                                    {team.l10Wins.toLocaleString()}
                                    -{team.l10Losses.toLocaleString()}
                                    -{team.l10OtLosses.toLocaleString()}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <TeamDialog dialogReference={dialog}
                        selectedTeam={selectedTeam}
                        fetchState={fetchState}
                        setFetchState={setFetchState}>
            </TeamDialog>
        </div>
    </div>;
}

export default TopTeams;
