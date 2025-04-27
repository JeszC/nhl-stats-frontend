import {useState} from "react";

function PlayerSearch({setSearchString}) {
    const [text, setText] = useState("");

    function search(event) {
        event.preventDefault();
        setSearchString(text);
    }

    function clear() {
        setText("");
        setSearchString("");
    }

    return <search>
        <form>
            <label className={"labelTitle"}>
                Search by name
                <input type={"search"}
                       name={"playerSearch"}
                       onChange={event => setText(event.target.value)}
                       placeholder={"Player name"}
                       value={text}/>
            </label>
            <div className={"horizontalFlex adjacentButtons"}>
                <button type={"submit"} title={"Search"} onClick={search}>Search</button>
                <button type={"reset"} title={"Clear"} onClick={clear}>Clear</button>
            </div>
        </form>
    </search>;
}

export default PlayerSearch;
