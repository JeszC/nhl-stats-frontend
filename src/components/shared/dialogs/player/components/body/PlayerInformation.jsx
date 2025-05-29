import {
    getHandSideTitle,
    getOrdinalNumber,
    getPlayerFullName,
    getPositionTitle
} from "../../../../../../scripts/parsing.js";

function PlayerInformation({player}) {

    function getClassName() {
        if (player.currentTeamAbbrev) {
            return `default ${player.currentTeamAbbrev} gradient`;
        }
        return "default gradient";
    }

    function getAge() {
        return Math.floor(new Date(new Date() - new Date(player.birthDate)).getFullYear() - 1970);
    }

    function getDraftInfo() {
        let draft = player.draftDetails;
        return <div className={"verticalFlex draftInformation"}>
            <div className={"horizontalFlex roundInformation"}>
                <span>{getOrdinalNumber(draft.round)} round</span>
                <span>{getOrdinalNumber(draft.pickInRound)}</span>
            </div>
            <div className={"horizontalFlex roundInformation"}>
                <span>Overall</span>
                <span>{getOrdinalNumber(draft.overallPick)}</span>
            </div>
            <span>{draft.year} by {draft.teamAbbrev}</span>
        </div>;
    }

    return <div className={`playerInformationBanner ${getClassName()}`}>
        <div className={"horizontalFlex playersBanner"}>
            <img className={`defaultImage playersImage ${getClassName()}`}
                 src={player.headshot}
                 alt={`${getPlayerFullName(player)} headshot`}/>
            <div className={"verticalFlex playersInformation"}>
                <div>
                    <h2>{getPlayerFullName(player)}</h2>
                    <div className={"horizontalFlex numberAndPosition"}>
                        {player.sweaterNumber ? <span>#{player.sweaterNumber.toLocaleString()}</span> : null}
                        <span>{getPositionTitle(player.position)}</span>
                    </div>
                </div>
                <div>
                    <h4>Current team</h4>
                    {
                        player.fullTeamName && player.currentTeamAbbrev
                        ? <span>{`${player.fullTeamName.default} (${player.currentTeamAbbrev})`}</span>
                        : <span>N/A</span>
                    }
                </div>
                <div>
                    <h4>Draft information</h4>
                    {
                        player.draftDetails
                        ? getDraftInfo()
                        : <span>Undrafted</span>
                    }
                </div>
            </div>
        </div>
        <div className={"dialogStatistics dialogPlayerStatistics"}>
            <div className={"verticalFlex"}>
                <h4>Place of birth</h4>
                <div className={"horizontalFlex playersCountryOfBirth"}>
                    <img src={player.countryFlag} alt={`${player.birthCountry} flag`} title={player.birthCountry}/>
                    {player.birthCity ? <span>{player.birthCity.default}</span> : null}
                </div>
            </div>
            <div className={"verticalFlex"}>
                <h4>Date of birth</h4>
                <span>
                    {
                        new Date(player.birthDate).toLocaleDateString([], {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        })
                    }
                </span>
            </div>
            {
                player.isActive
                ? <div className={"verticalFlex"}>
                    <h4>Age</h4>
                    <span>{getAge().toLocaleString()}</span>
                </div>
                : null
            }
            <div className={"verticalFlex"}>
                <h4>Height</h4>
                <span>{player.heightInCentimeters.toLocaleString()} cm</span>
            </div>
            <div className={"verticalFlex"}>
                <h4>Weight</h4>
                <span>{player.weightInKilograms.toLocaleString()} kg</span>
            </div>
            <div className={"verticalFlex"}>
                {player.position === "G" ? <h4>Glove side</h4> : <h4>Shooting side</h4>}
                <span>{getHandSideTitle(player.shootsCatches)}</span>
            </div>
        </div>
    </div>;
}

export default PlayerInformation;
