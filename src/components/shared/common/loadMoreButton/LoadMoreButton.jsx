import constants from "../../../../data/constants.json";

function LoadMoreButton({areAllFetched, fetchState, setPage}) {
    const isLoading = fetchState === constants.fetchState.loading;

    return <>
        {
            areAllFetched
            ? null
            : <button type={"button"}
                      className={"loadMoreButton"}
                      title={isLoading ? "Loading..." : "Load more"}
                      disabled={isLoading}
                      onClick={() => setPage(previousPage => previousPage + 1)}>
                {
                    isLoading ? "Loading..." : "Load more"
                }
            </button>
        }
    </>;
}

export default LoadMoreButton;
