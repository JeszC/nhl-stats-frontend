function Header({game}) {

    return <>
        {
            game && Object.keys(game).length > 0
            ? <>
                <img className={`defaultImage headerImage default ${game.awayTeam.abbrev} gradient`}
                     src={game.awayTeam.logo}
                     alt={`${game.awayTeam.abbrev} logo`}/>
                <h1 className={"teamAbbreviation"}>{game.awayTeam.abbrev} - {game.homeTeam.abbrev}</h1>
                <img className={`defaultImage headerImage default ${game.homeTeam.abbrev} gradient`}
                     src={game.homeTeam.logo}
                     alt={`${game.homeTeam.abbrev} logo`}/>
            </>
            : null
        }
    </>;
}

export default Header;
