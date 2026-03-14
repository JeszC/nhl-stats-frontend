function Award({award, openDialog}) {

    return <button key={award.id}
                   type={"button"}
                   className={"horizontalFlex trophy"}
                   title={"Show trophy details"}
                   onClick={() => openDialog(award)}>
        <img className={"trophyImageButton"} src={award.imageUrl} alt={award.name}/>
        <div className={"verticalFlex trophyInformation"}>
            <span className={"trophyName"}>{award.name}</span>
            <span>{award.briefDescription}</span>
        </div>
    </button>;
}

export default Award;
