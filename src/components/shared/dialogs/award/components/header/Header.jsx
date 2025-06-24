function Header({trophy}) {

    return <>
        {
            trophy
            ? <>
                <img className={`defaultImage headerImage`} src={trophy.imageUrl} alt={trophy.name}/>
                <div className={"verticalFlex"}>
                    <span>{trophy.name}</span>
                </div>
            </>
            : null
        }
    </>;
}

export default Header;
