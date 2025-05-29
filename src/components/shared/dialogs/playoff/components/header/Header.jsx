function Header({series}) {
    return <>
        {
            series && series.bottomSeedTeam && series.topSeedTeam
            ? <h3>{series.roundLabel}</h3>
            : null
        }
    </>;
}

export default Header;
