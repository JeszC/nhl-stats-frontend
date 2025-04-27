import About from "./components/About.jsx";
import Disclaimer from "./components/Disclaimer.jsx";
import Help from "./components/Help.jsx";

function SidebarHelp({showSidebar, title, components}) {

    return <aside className={showSidebar ? "help" : "hidden"}>
        <header className={"helpHeader"}>
            <h3>{title}</h3>
        </header>
        <article>
            {
                components && components.length > 0
                ? components.map((component, index) =>
                    <section key={`component${index.toString()}`}>{component}</section>
                )
                : null
            }
            <Help></Help>
            <About></About>
            <Disclaimer></Disclaimer>
        </article>
    </aside>;
}

export default SidebarHelp;
