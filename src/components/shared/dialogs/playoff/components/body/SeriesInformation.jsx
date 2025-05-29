function SeriesInformation({series}) {

    return <>
        {
            series && Object.keys(series).length > 0
            ? <>
                {
                    series.seriesLogo
                    ? <div className={"eventBanner"}>
                        <img className={"eventBannerImage"} src={series.seriesLogo} alt={"Series logo"}/>
                    </div>
                    : null
                }
                {
                    series && series.bottomSeedTeam && series.topSeedTeam
                    ? <div className={"horizontalFlex playoffBanner"}>
                        <div className={`horizontalFlex teamBackground default
                         ${series.bottomSeedTeam.abbrev} gradient`}>
                            <img src={series.bottomSeedTeam.logo} alt={`${series.bottomSeedTeam.abbrev} logo`}/>
                            <div className={"verticalFlex playoffBannerInformation"}>
                                <h4>{series.bottomSeedTeam.abbrev}</h4>
                                <span className={"playoffScore"}>
                                    {series.bottomSeedTeam.seriesWins.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className={`horizontalFlex teamBackground default
                         ${series.topSeedTeam.abbrev} gradient`}>
                            <div className={"verticalFlex playoffBannerInformation"}>
                                <h4>{series.topSeedTeam.abbrev}</h4>
                                <span className={"playoffScore"}>
                                    {series.topSeedTeam.seriesWins.toLocaleString()}
                                </span>
                            </div>
                            <img src={series.topSeedTeam.logo} alt={`${series.topSeedTeam.abbrev} logo`}/>
                        </div>
                    </div>
                    : null
                }
            </>
            : null
        }
    </>;
}

export default SeriesInformation;
