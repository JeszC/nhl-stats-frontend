import Award from "./awardgrid/components/Award.jsx";
import AwardCategory from "./awardgrid/components/AwardCategory.jsx";

function AwardGrid({awards, openDialog}) {
    const awardsGroupedByCategory = Object.groupBy(awards, award => award.categoryId);

    function getAwardsForCategory(category) {
        if (awardsGroupedByCategory[category] != null) {
            return awardsGroupedByCategory[category].map(trophy =>
                <Award award={trophy} openDialog={openDialog}></Award>
            );
        }
        return null;
    }

    function getAwardsForRemainingCategories(initialCategory) {
        let awards = [];
        let keys = Object.keys(awardsGroupedByCategory);
        for (let i = initialCategory; i < keys.length + 1; i++) {
            awards = awards.concat(getAwardsForCategory(i));
        }
        return awards;
    }

    return <div className={"trophies"}>
        <AwardCategory title={"Team awards"}
                       awards={getAwardsForCategory(1)}>
        </AwardCategory>
        <AwardCategory title={"Player awards"}
                       awards={getAwardsForCategory(2)}>
        </AwardCategory>
        <AwardCategory title={"Staff awards"}
                       awards={getAwardsForCategory(3).concat(getAwardsForCategory(4))}>
        </AwardCategory>
        <AwardCategory title={"Miscellaneous awards"}
                       awards={getAwardsForRemainingCategories(5)}>
        </AwardCategory>
    </div>;
}

export default AwardGrid;
