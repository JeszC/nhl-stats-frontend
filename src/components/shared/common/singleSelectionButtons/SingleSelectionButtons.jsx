import {useCallback, useState} from "react";

function SingleSelectionButtons({buttonData, setData, classes, selectionClasses}) {
    const [selectedButton, setSelectedButton] = useState(null);
    const separator = " ";
    const selectedClassNames = `selectedSingleSelectionButton ${selectionClasses?.toString().replace(",", separator)}`;

    const highlightDefaultButton = useCallback(defaultButton => {
        if (defaultButton) {
            defaultButton.classList.add(...selectedClassNames.split(separator));
            setSelectedButton(defaultButton);
        }
    }, [selectedClassNames]);

    function selectButton(event) {
        setData(event.target.value);
        if (selectedButton) {
            selectedButton.classList.remove(...selectedClassNames.split(separator));
        }
        event.target.classList.add(...selectedClassNames.split(separator));
        setSelectedButton(event.target);
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
