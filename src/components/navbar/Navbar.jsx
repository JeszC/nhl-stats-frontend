import {Fragment} from "react";
import {Link, Route, Routes, useLocation} from "react-router";
import ErrorPage from "../pages/error/ErrorPage";
import hamburgerMenuIcon from "./images/Hamburger.svg";
import helpMenuIcon from "./images/Help.svg";
import "./Navbar.css";

function Navbar({components, showOptions, setShowOptions, showHelp, setShowHelp}) {
    const homePagePath = "/";
    let currentPagePath = useLocation().pathname;

    function getButtonType(url) {
        let buttonType = "navBarButton transparentButton";
        if (url === currentPagePath) {
            buttonType += " selectedView";
        }
        if (url === homePagePath) {
            buttonType += " homePage";
        }
        return buttonType;
    }

    return <>
        <nav>
            <menu className={"horizontalFlex navBarLinks"}>
                {
                    components.map((component, index) =>
                        <li key={component.linkText + index.toString()} className={"navBarLink"}>
                            <Link to={component.linkURL} className={"routerLink"}>
                                <button type={"button"}
                                        className={getButtonType(component.linkURL)}
                                        title={component.linkText}>
                                    <img className={"icon"} src={component.icon} alt={component.linkText}/>
                                    <span className={"pageTitle"}>{component.linkText}</span>
                                </button>
                            </Link>
                        </li>
                    )
                }
            </menu>
        </nav>
        <button type={"button"}
                className={showOptions
                           ? "sidebarButton hamburgerButton sidebarButtonActive"
                           : "sidebarButton hamburgerButton"}
                title={showOptions ? "Hide options" : "Show options"}
                onClick={() => setShowOptions(!showOptions)}>
            <img className={"icon"} src={hamburgerMenuIcon} alt={"Hamburger menu icon"}/>
        </button>
        <button type={"button"}
                className={showHelp
                           ? "sidebarButton helpButton sidebarButtonActive"
                           : "sidebarButton helpButton"}
                title={showHelp ? "Hide help" : "Show help"}
                onClick={() => setShowHelp(!showHelp)}>
            <img className={"icon"} src={helpMenuIcon} alt={"Help menu icon"}/>
        </button>
        <Routes>
            {
                components.map((component, index) =>
                    <Route key={component.linkURL + index.toString()}
                           path={component.linkURL}
                           element={component.component}>
                    </Route>
                )
            }
            <Route path={"*"} element={<ErrorPage/>}></Route>
        </Routes>
    </>;
}

export default Navbar;
