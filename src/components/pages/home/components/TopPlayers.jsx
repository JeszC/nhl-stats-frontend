import {useEffect, useRef, useState} from "react";
import constants from "../../../../data/constants.json";
import homeCategories from "../../../../data/home.json";
import {getValue} from "../../../../scripts/utils.js";
import SingleSelectionButtons from "../../../shared/common/singleSelectionButtons/SingleSelectionButtons";
import PlayerDialog from "../../../shared/dialogs/player/PlayerDialog";
import PlayerTable from "./PlayerTable";

function TopPlayers({players, headerText, areGoalies}) {
    const [upperCategory, setUpperCategory] = useState(null);
    const [lowerCategory, setLowerCategory] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState({});
    const [fetchState, setFetchState] = useState(constants.fetchState.finished);
    const dialog = useRef(null);

    function getUpperCategories() {
        let data = [];
        for (let upperCategory of Object.keys(homeCategories.upperCategories)) {
            let category = {
                default: homeCategories.upperCategories[upperCategory].default,
                value: upperCategory,
                text: homeCategories.upperCategories[upperCategory].text,
                title: homeCategories.upperCategories[upperCategory].title
            };
            data.push(category);
        }
        return data;
    }

    function getLowerCategories() {
        let data = [];
        let playerCategory = areGoalies ? homeCategories.lowerCategoriesGoalie : homeCategories.lowerCategoriesSkater;
        for (let lowerCategory of Object.keys(playerCategory)) {
            let category = {
                default: playerCategory[lowerCategory].default,
                value: lowerCategory,
                text: playerCategory[lowerCategory].text,
                title: playerCategory[lowerCategory].title
            };
            data.push(category);
        }
        return data;
    }

    function getPlayerData() {
        if (upperCategory && lowerCategory) {
            let upperKey = homeCategories.upperCategories[upperCategory].nhlKey;
            let lowerKey;
            if (areGoalies) {
                lowerKey = homeCategories.lowerCategoriesGoalie[lowerCategory].nhlKey;
            } else {
                lowerKey = homeCategories.lowerCategoriesSkater[lowerCategory].nhlKey;
            }
            let path = [upperKey, lowerKey];
            return getValue(path, players);
        }
        return [];
    }

    useEffect(() => {
        function createCategories() {
            for (let upperCategory of Object.keys(homeCategories.upperCategories)) {
                if (homeCategories.upperCategories[upperCategory].default) {
                    setUpperCategory(upperCategory);
                }
            }
            if (areGoalies) {
                for (let lowerCategory of Object.keys(homeCategories.lowerCategoriesGoalie)) {
                    if (homeCategories.lowerCategoriesGoalie[lowerCategory].default) {
                        setLowerCategory(lowerCategory);
                    }
                }
            } else {
                for (let lowerCategory of Object.keys(homeCategories.lowerCategoriesSkater)) {
                    if (homeCategories.lowerCategoriesSkater[lowerCategory].default) {
                        setLowerCategory(lowerCategory);
                    }
                }
            }
        }

        createCategories();
    }, [areGoalies]);

    return <div>
        <h2>{headerText}</h2>
        <div className={"verticalFlex tableAndTabs"}>
            <div className={"horizontalFlex tabs homeTabs playerTabs"}>
                <SingleSelectionButtons buttonData={getUpperCategories()}
                                        setData={setUpperCategory}
                                        classes={"tab homeTab"}
                                        selectionClasses={["activeTab"]}>
                </SingleSelectionButtons>
            </div>
            <div className={"horizontalFlex tabs homeTabs playerTabs"}>
                <SingleSelectionButtons buttonData={getLowerCategories()}
                                        setData={setLowerCategory}
                                        classes={"tab homeTab"}
                                        selectionClasses={["activeTab"]}>
                </SingleSelectionButtons>
            </div>
            <PlayerTable dialog={dialog}
                         category={areGoalies
                                   ? homeCategories.lowerCategoriesGoalie[lowerCategory]
                                   : homeCategories.lowerCategoriesSkater[lowerCategory]}
                         players={getPlayerData()}
                         setSelectedPlayer={setSelectedPlayer}
                         setFetchState={setFetchState}>
            </PlayerTable>
            <PlayerDialog dialogReference={dialog}
                          selectedPlayer={selectedPlayer}
                          fetchState={fetchState}>
            </PlayerDialog>
        </div>
    </div>;
}

export default TopPlayers;
