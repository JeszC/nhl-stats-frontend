import officialIndicator from "../../../../images/Official.svg";

function Official({official, type}) {
    return <div key={official.fullName.default} className={"horizontalFlex playerInformation"}>
        {
            official.headshot
            ? <img className={"defaultImage gamesImage default gradient"}
                   src={official.headshot}
                   alt={`${official.fullName.default} headshot`}/>
            : <img className={"defaultImage gamesImage default gradient"}
                   src={officialIndicator}
                   alt={"Official headshot"}/>
        }
        <div className={"verticalFlex"}>
            <span className={"primary"}>{official.fullName.default}</span>
            <span className={"secondary"}>{type}</span>
            <div className={"horizontalFlex stats scratchStats playersCountryOfBirth"}>
                {
                    official.nationalityCode
                    ? <img src={official.countryFlag}
                           alt={`${official.nationalityCode} flag`}
                           title={official.nationalityCode}/>
                    : null
                }
                {
                    official.sweaterNumber
                    ? <span className={"scratchSingleStat"}>
                        #{official.sweaterNumber.toLocaleString()}
                    </span>
                    : null
                }
            </div>
        </div>
    </div>;
}

export default Official;
