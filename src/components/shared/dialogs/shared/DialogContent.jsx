import {useEffect, useRef} from "react";
import constants from "../../../../data/constants.json";
import Slider from "../../animations/slider/Slider.jsx";
import ErrorDialog from "../../errors/ErrorDialog.jsx";
import BackButtonIcon from "../../images/Back.svg";
import CloseButtonIcon from "../../images/Close.svg";

function DialogContent({headerData, bodyData, fetchState, onBack, closeDialog}) {
    const backButton = useRef(null);

    function setUpOnLoad() {
        if (backButton.current) {
            backButton.current.focus();
        }
    }

    useEffect(setUpOnLoad, []);

    return <>
        <div className={"horizontalFlex gamesSummary"}>
            <button ref={backButton}
                    type={"button"}
                    className={"transparentButton dialogLeftElement"}
                    title={"Back"}
                    disabled={onBack === undefined}
                    onClick={onBack}>
                <img className={"icon"} src={BackButtonIcon} alt={"Back button icon"}/>
            </button>
            {
                fetchState === constants.fetchState.loading
                ? <span>Loading...</span>
                : fetchState === constants.fetchState.error
                  ? <span>Error loading content.</span>
                  : headerData
            }
            <button type={"button"}
                    className={"transparentButton dialogRightElement"}
                    title={"Close"}
                    onClick={closeDialog}>
                <img className={"icon"} src={CloseButtonIcon} alt={"Close button icon"}/>
            </button>
        </div>
        {
            fetchState === constants.fetchState.loading
            ? <Slider></Slider>
            : fetchState === constants.fetchState.error
              ? <ErrorDialog errorMessage={"Could not load content. Server might be offline."}></ErrorDialog>
              : bodyData
        }
    </>;
}

export default DialogContent;
