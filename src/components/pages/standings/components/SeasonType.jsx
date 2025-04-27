import constants from "../../../../data/constants.json";

function SeasonType({seasonType, setSeasonType}) {

    return <>
        <h4>Season type</h4>
        {
            seasonType === constants.gameType.season.name
            ? <button type={"button"}
                      title={"Show playoff tree"}
                      onClick={() => setSeasonType(constants.gameType.playoff.name)}>
                Show playoff tree
            </button>
            : <button type={"button"}
                      title={"Show standings"}
                      onClick={() => setSeasonType(constants.gameType.season.name)}>
                Show standings
            </button>
        }
    </>;
}

export default SeasonType;
