import {getPlayerFullName} from "../../../../../../scripts/parsing.js";

function Header({player}) {

    return <>
        {
            player && Object.keys(player).length > 0
            ? <>
                <img className={`defaultImage headerImage default ${player.currentTeamAbbrev} gradient`}
                     src={player.headshot}
                     alt={`${getPlayerFullName(player)} headshot`}/>
                <span>{getPlayerFullName(player)}</span>
            </>
            : null
        }
    </>;
}

export default Header;
