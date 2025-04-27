import constants from "../../../../data/constants.json";

function About() {

    return <section>
        <details>
            <summary>About</summary>
            <p>This website contains information and statistics about NHL games, teams and players.</p>
            <h4>Developers</h4>
            <ul className={"externalLinks"}>
                {
                    constants.developers.map((developer, index) =>
                        <li key={developer.name + index.toString()}>
                            {developer.name} (
                            <a target={"_blank"}
                               rel={"noopener noreferrer"}
                               href={developer.url}
                               title={developer.linkTitle}>
                                {developer.linkText}
                            </a>)
                        </li>
                    )
                }
            </ul>
            <h4>Resources used</h4>
            <ul className={"externalLinks"}>
                {
                    constants.externalResources.map((resource, index) =>
                        <li key={resource.url + index.toString()}>
                            <a target={"_blank"}
                               rel={"noopener noreferrer"}
                               href={resource.url}
                               title={resource.linkTitle}>
                                {resource.linkText}
                            </a>
                        </li>
                    )
                }
            </ul>
        </details>
    </section>;
}

export default About;
