import {useCallback, useState} from "react";

function SingleSelectionButtons({buttonData, setData, classes, selectionClasses}) {
    const [selectedButton, setSelectedButton] = useState(null);
    const selectedItemClassNames = ["selectedSingleSelectionButton", ...(selectionClasses ? selectionClasses : [])];

    const highlightDefaultButton = useCallback(defaultButton => {
        if (defaultButton) {
            addSelectionClasses(defaultButton);
            setSelectedButton(defaultButton);
        }
        // Following eslint recommendations breaks the buttons visually, which is why this rule is ignored.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function selectButton(event) {
        setData(event.target.value);
        if (selectedButton) {
            removeSelectionClasses(selectedButton);
        }
        addSelectionClasses(event.target);
        setSelectedButton(event.target);
    }

    function addSelectionClasses(target) {
        for (let selectedItemClassName of selectedItemClassNames) {
            target.classList.add(selectedItemClassName);
        }
    }

    function removeSelectionClasses(target) {
        for (let selectedItemClassName of selectedItemClassNames) {
            target.classList.remove(selectedItemClassName);
        }
    }

    return <>
        {
            buttonData.map((button, index) =>
                button.default
                ? <button key={button.value + index.toString()}
                          ref={highlightDefaultButton}
                          type={"button"}
                          className={classes ? classes : ""}
                          title={button.title}
                          value={button.value}
                          onClick={selectButton}>
                    {button.text}
                </button>
                : <button key={button.value + index.toString()}
                          type={"button"}
                          className={classes ? classes : ""}
                          value={button.value}
                          title={button.title}
                          onClick={selectButton}>
                    {button.text}
                </button>
            )
        }
    </>;
}

export default SingleSelectionButtons;
