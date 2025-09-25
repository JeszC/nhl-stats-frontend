import {parseDecimals} from "../../../../../../../../scripts/parsing.js";

function FinalTeamInfo({game, team, numberOfCategories}) {
    const teamGameStatsKey = `${team.substring(0, team.length - 4)}Value`;
    const placeholderValue = "N/A";

    function parseCategory(category) {
        if (category.category === "faceoffWinningPctg") {
            return parseDecimals(category[teamGameStatsKey]);
        } else if (category.category === "powerPlay") {
            let powerPlayParts = category[teamGameStatsKey].split("/");
            let goals = parseInt(powerPlayParts[0]).toLocaleString();
            let powerPlays = parseInt(powerPlayParts[1]).toLocaleString();
            return `${goals}/${powerPlays}`;
        }
        return category[teamGameStatsKey]?.toLocaleString();
    }

    function formatCategories(categories) {
        let unusedCategoriesRemoved = removeUnusedCategories(categories);
        return fillMissingCategories(unusedCategoriesRemoved);
    }

    function removeUnusedCategories(categories) {
        let categoriesToRemove = ["faceoffWinningPctg", "powerPlayPctg"];
        let categoriesCopy = categories.slice();
        for (let categoryToRemove of categoriesToRemove) {
            let categoryKey = categoriesCopy.findIndex(value => value.category === categoryToRemove);
            if (categoryKey >= 0) {
                categoriesCopy.splice(categoryKey, 1);
            }
        }
        return categoriesCopy;
    }

    function fillMissingCategories(categories) {
        let placeholder = {
            "category": "placeholderCategory",
            [teamGameStatsKey]: placeholderValue
        };
        let filledCategories = [].concat(categories);
        for (let i = filledCategories.length; i < numberOfCategories; i++) {
            filledCategories.push(placeholder);
        }
        return filledCategories;
    }

    return <>
        <div className={"verticalFlex statisticsColumn"}>
            <span className={`statisticsHeader ${game[team].abbrev} border`}>{game[team].abbrev}</span>
            <span>
                {
                    game.summary.seasonSeriesWins.neededToWin === undefined
                    ? game.summary.seasonSeriesWins[`${team}Wins`].toLocaleString()
                    : `${game.summary.seasonSeriesWins[`${team}Wins`]
                        .toLocaleString()}/${game.summary.seasonSeriesWins.neededToWin.toLocaleString()}`
                }
            </span>
            {
                formatCategories(game.summary.teamGameStats).map((category, index) =>
                    <span key={category + index.toString()}>{parseCategory(category)}</span>
                )
            }
        </div>
    </>;
}

export default FinalTeamInfo;
