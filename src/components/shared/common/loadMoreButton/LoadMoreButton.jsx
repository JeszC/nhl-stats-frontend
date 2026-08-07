import constants from "../../../../data/constants.json";

function LoadMoreButton({areAllFetched, fetchState, setPage}) {
    const isLoading = fetchState === constants.fetchState.loading;

    function getTitle() {
        if (fetchState === constants.fetchState.error) {
            return "Retry";
        }
        if (isLoading) {
            return "Loading...";
        }
        return "Load more";
    }

    return <>
        {
            areAllFetched
            ? null
            : <button type={"button"}
                      className={"loadMoreButton"}
                      title={getTitle()}
                      disabled={isLoading}
                      onClick={() => setPage(previousPage => previousPage + 1)}>
                {getTitle()}
            </button>
        }
    </>;
}

export default LoadMoreButton;
