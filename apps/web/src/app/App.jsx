import { useState } from "react";
import axios from "axios";
import errorHandler from "../utils/errorHandler";

const App = () => {
    const [counter, setCounter] = useState(0);
    const [inputValue, setInputValue] = useState("");

    const getData = async () => {
        try {
            console.log("Getting data...");

            const res = await axios.get("/api/test-get");

            console.log("res >>", res.data);
        } catch (error) {
            errorHandler(error);
        }
    };

    const postData = async () => {
        try {
            console.log("Posting Data...");

            const res = await axios.post("/api/test-post", {
                data: inputValue,
            });

            if (res.data?.ok && res.data?.text) {
                console.log(">> " + res.data.text);
            } else {
                console.log("PROBLEM!!! >> ", res.data);
            }
        } catch (error) {
            errorHandler(error);
        }
    };

    return (
        <div>
            <div>counter {counter}</div>

            <input
                type="button"
                value="Click Me"
                onClick={() => setCounter((prevState) => prevState + 1)}
            />

            <input type="button" value="GET Data" onClick={getData} />

            <br />
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <input type="button" value="POST Data" onClick={postData} />
        </div>
    );
};

export default App;
