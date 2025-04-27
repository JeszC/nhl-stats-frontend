import {useEffect, useState} from "react";

function Biography({player}) {
    const [showMoreButtonVisible, setShowMoreButtonVisible] = useState(false);
    const splitStringsNotes = ["*", "-"];
    const splitParagraphsCharacter = "\n";
    const linkSplitCharacter = "[";

    function getTextParagraphs() {
        let paragraphs = player.biography.split(splitParagraphsCharacter);
        let textParagraphs = [];
        for (let i = 0; i < paragraphs.length; i++) {
            let paragraph = paragraphs[i];
            let key = paragraph.slice(0, 20) + i.toString();
            if (paragraph.includes(linkSplitCharacter)) {
                let linkParagraph = createLinkParagraph(paragraph, key);
                textParagraphs.push(linkParagraph);
            } else if (!startsWithSplitString(paragraph) && paragraph.trim().length > 0) {
                textParagraphs.push(<p key={key}>{paragraph}</p>);
            }
        }
        return textParagraphs;
    }

    function getNoteParagraphs() {
        let paragraphs = player.biography.split(splitParagraphsCharacter);
        let noteParagraphs = [];
        for (let i = 0; i < paragraphs.length; i++) {
            let paragraph = paragraphs[i];
            let key = paragraph.slice(0, 20) + i.toString();
            if (noteParagraphs.length === 0 && startsWithSplitString(paragraph) && paragraph.trim().length > 0) {
                noteParagraphs.push(<p key={key} className={"biographySubheading"}>{paragraph.slice(2, -2)}</p>);
            } else if (startsWithSplitString(paragraph) && paragraph.trim().length > 0) {
                noteParagraphs.push(<li key={key}>{paragraph.slice(1)}</li>);
            }
        }
        if (noteParagraphs.length > 0) {
            let noteHeading = noteParagraphs.slice(0, 1);
            let noteList = noteParagraphs.slice(1, noteParagraphs.length);
            return <>
                {noteHeading}
                <ul>{noteList}</ul>
            </>;
        }
        return noteParagraphs;
    }

    function startsWithSplitString(paragraph) {
        for (let splitString of splitStringsNotes) {
            if (paragraph.startsWith(splitString)) {
                return true;
            }
        }
        return false;
    }

    function createLinkParagraph(paragraph, key) {
        let paragraphParts = paragraph.split("[");
        let linkParts = paragraphParts[1].split("]");
        let paragraphStart = paragraphParts[0];
        let linkText = linkParts[0];
        let linkURL = linkParts[1].slice(1, -1);
        return <p key={key}>
            {paragraphStart}
            <a target={"_blank"} rel={"noopener noreferrer"} href={linkURL} title={"Full article"}>{linkText}</a>
        </p>;
    }

    function handleKeyboard(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            let input = event.target.control;
            input.checked = !input.checked;
        }
    }

    function setShowMoreButtonStyle() {
        let biographyElement = Array.from(document.getElementsByClassName("biography"));
        if (biographyElement.length > 0) {
            let biographyStyle = window.getComputedStyle(biographyElement[0]);
            let biographyHeight = parseInt(biographyStyle.height);
            let biographyMaxHeight = parseInt(biographyStyle.maxHeight);
            biographyHeight >= biographyMaxHeight ? setShowMoreButtonVisible(true) : setShowMoreButtonVisible(false);
        } else {
            setShowMoreButtonVisible(false);
        }
    }

    function setUpOnLoad() {
        setShowMoreButtonStyle();
    }

    useEffect(setUpOnLoad, []);

    return <>
        {
            player.biography
            ? <div className={"teamsContent"}>
                <div className={"biography"}>
                    <h2>Biography</h2>
                    {getTextParagraphs()}
                    {getNoteParagraphs()}
                </div>
                {
                    showMoreButtonVisible
                    ? <>
                        <input id={"showMoreLess"} type={"checkbox"} tabIndex={0}/>
                        <label htmlFor={"showMoreLess"} role={"button"} tabIndex={0} onKeyDown={handleKeyboard}></label>
                    </>
                    : null
                }
            </div>
            : null
        }
    </>;
}

export default Biography;
