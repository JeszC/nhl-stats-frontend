function SidebarOptions({showSidebar, title, components}) {

    return <aside className={showSidebar ? "options" : "hidden"}>
        <header className={"optionsHeader"}>
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
        </article>
    </aside>;
}

export default SidebarOptions;
