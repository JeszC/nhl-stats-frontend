import {useEffect, useEffectEvent, useState} from "react";

function PageBar({items, options, numberOfItemsToShowPerPage, page, setPage}) {
    const [hideBottomBorder, setHideBottomBorder] = useState(false);
    const firstPage = 0;
    const lastPage = Math.max(0, Math.floor((items.length - 1) / Math.max(1, numberOfItemsToShowPerPage)));

    function goToFirstPage() {
        setPage(firstPage);
    }

    function goToPreviousPage() {
        if (page > firstPage) {
            setPage(page - 1);
        }
    }

    function goToNextPage() {
        if (page < lastPage) {
            setPage(page + 1);
        }
    }

    function goToLastPage() {
        setPage(lastPage);
    }

    function getPageInformation() {
        let currentPage = (page + 1).toLocaleString();
        let pages = (Math.max(Math.ceil(items.length / Math.max(1, numberOfItemsToShowPerPage)), 1)).toLocaleString();
        return `${currentPage} / ${pages}`;
    }

    const showOrHideBottomBorder = useEffectEvent(() => {
        let mainContent = Array.from(document.getElementsByTagName("main"));
        let navBar = Array.from(document.getElementsByTagName("nav"));
        if (mainContent.length > 0 && navBar.length > 0) {
            let windowHeight = window.innerHeight;
            let mainContentStyle = window.getComputedStyle(mainContent[0]);
            let navBarStyle = window.getComputedStyle(navBar[0]);
            let mainContentHeight = parseInt(mainContentStyle.height);
            let navBarHeight = parseInt(navBarStyle.height);
            windowHeight - navBarHeight <= mainContentHeight ? setHideBottomBorder(true) : setHideBottomBorder(false);
        }
    });

    useEffect(() => {
        showOrHideBottomBorder();
    }, [items, options, page]);

    return <div className={hideBottomBorder ? "horizontalFlex pageBar noBottomBorder" : "horizontalFlex pageBar"}>
        <button type={"button"}
                title={"To first page"}
                onClick={goToFirstPage}
                disabled={page === firstPage}>
            <span>«</span>
        </button>
        <button type={"button"}
                title={"To previous page"}
                onClick={goToPreviousPage}
                disabled={page === firstPage}>
            <span>‹</span>
        </button>
        <span className={"pageIndicator"}>{getPageInformation()}</span>
        <button type={"button"}
                title={"To next page"}
                onClick={goToNextPage}
                disabled={page === lastPage}>
            <span>›</span>
        </button>
        <button type={"button"}
                title={"To last page"}
                onClick={goToLastPage}
                disabled={page === lastPage}>
            <span>»</span>
        </button>
    </div>;
}

export default PageBar;
