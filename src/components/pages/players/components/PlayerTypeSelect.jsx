import GoalieIndicator from "../images/Goal.svg";
import SkaterIndicator from "../images/Stick.svg";

function PlayerTypeSelect({
                              showGoalies,
                              setShowGoalies,
                              applySorting,
                              defaultSkaterHeader,
                              defaultGoalieHeader,
                              defaultSortedCategorySkater,
                              defaultSortedCategoryGoalie,
                              localStorageKey
                          }) {

    function showGoalieView() {
        setShowGoalies(true);
        localStorage.setItem(localStorageKey, true.toString());
        applySorting(defaultSortedCategoryGoalie, false, defaultGoalieHeader.current);
    }

    function showSkaterView() {
        setShowGoalies(false);
        localStorage.setItem(localStorageKey, false.toString());
        applySorting(defaultSortedCategorySkater, false, defaultSkaterHeader.current);
    }

    return <>
        <h4>Player type</h4>
        <button type={"button"}
                className={"buttonWithIcon"}
                title={"Show goalies"}
                hidden={showGoalies}
                onClick={showGoalieView}>
            <span>Show goalies</span>
            <img className={"buttonIndicator"} src={GoalieIndicator} alt={"Goalie indicator"}/>
        </button>
        <button type={"button"}
                className={"buttonWithIcon"}
                title={"Show skaters"}
                hidden={!showGoalies}
                onClick={showSkaterView}>
            <span>Show skaters</span>
            <img className={"buttonIndicator"} src={SkaterIndicator} alt={"Skater indicator"}/>
        </button>
    </>;
}

export default PlayerTypeSelect;
