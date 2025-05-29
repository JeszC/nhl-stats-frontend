import awardIcon from "../images/Trophy.svg";

function Awards({player}) {

    function getAwardYears(award) {
        let years = [];
        award.seasons.slice().reverse().forEach(season =>
            years.push(`${season.seasonId.toString().slice(0, 4)}-${season.seasonId.toString().slice(4)}`));
        return years;
    }

    return <>
        {
            player.awards || player.badges.length > 0
            ? <div className={"teamsContent"}>
                <div className={"teamsPlayers"}>
                    <h2>Awards/accolades</h2>
                    <div className={"teamsGrid awardGrid"}>
                        {
                            player.badges.map(badge =>
                                <div key={badge.title.default} className={"horizontalFlex teamsPlayer"}>
                                    {
                                        badge.logoUrl.default
                                        ? <img className={"awardImage"}
                                               src={badge.logoUrl.default}
                                               alt={`${badge.title.default} icon`}/>
                                        : <img className={"awardImagePlaceholder"} src={awardIcon} alt={"Award icon"}/>
                                    }
                                    <div className={"verticalFlex teamsInformation"}>
                                        <h3>{badge.title.default}</h3>
                                    </div>
                                </div>
                            )
                        }
                        {
                            player.awards?.map(award =>
                                <div key={award.trophy.default} className={"horizontalFlex teamsPlayer"}>
                                    {
                                        award.imageUrl
                                        ? <img className={"awardImage"}
                                               src={award.imageUrl}
                                               alt={`${award.trophy.default} icon`}/>
                                        : <img className={"awardImagePlaceholder"} src={awardIcon} alt={"Award icon"}/>
                                    }
                                    <div className={"verticalFlex teamsInformation"}>
                                        <h3>{award.trophy.default}</h3>
                                        <span>{award.briefDescription}</span>
                                        <div className={"awardYears"}>
                                            {
                                                getAwardYears(award).map(awardYear =>
                                                    <span key={awardYear}>{awardYear}</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            : null
        }
    </>;
}

export default Awards;
