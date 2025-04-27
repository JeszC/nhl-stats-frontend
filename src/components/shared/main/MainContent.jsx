function MainContent({showOptions, showHelp, content}) {

    function reserveSpaceForSidebars() {
        if (showOptions) {
            return showHelp ? "optionsMargin helpMargin" : "optionsMargin";
        }
        return showHelp ? "helpMargin" : "";
    }

    return <main className={reserveSpaceForSidebars()}>{content}</main>;
}

export default MainContent;
