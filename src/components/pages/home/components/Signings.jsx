import constants from "../../../../data/constants.json";

function Signings({signings, areAllSigningsFetched, fetchState, setSigningsPage}) {
    const isLoading = fetchState === constants.fetchState.loading;
    const formatterDate = new Intl.DateTimeFormat(undefined, {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });

    return signings.length === 0
           ? null
           : fetchState === constants.fetchState.error
             ? <span>Error fetching signings</span>
             : <div>
                 <>
                     {
                         signings.map(signing =>
                             <p key={signing.post_id + signing.signing_date}>
                                 {signing.name}, {signing.signing_date}, {signing.team_shortname}
                             </p>
                         )
                     }
                     {
                         areAllSigningsFetched
                         ? null
                         : <button type={"button"}
                                   className={"loadMoreButton"}
                                   title={isLoading ? "Loading..." : "Load more"}
                                   disabled={isLoading}
                                   onClick={() => setSigningsPage(previousPage => previousPage + 1)}>
                             {isLoading ? "Loading..." : "Load more"}
                         </button>
                     }
                     {console.log(signings)}
                 </>
             </div>;
}

export default Signings;
