function AwardCategory({title, awards}) {

    return <div>
        <h2>{title}</h2>
        <div className={"trophyGrid"}>{awards}</div>
    </div>;
}

export default AwardCategory;
