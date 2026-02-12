import { useState } from "react";
import axios from "axios";

const App = () => {
    const [counter, setCounter] = useState(0);

    const getData = async () => {
        try {
            console.log(import.meta.env.VITE_SERVER_PORT);

            const data = await axios.get(
                `http://localhost:${import.meta.env.VITE_SERVER_PORT}/test-get`
            );

            console.log("data >>", data.data);
        } catch (error) {
            console.error("Error >>", error);
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

            <input type="button" value="Get Data" onClick={getData} />
        </div>
    );
};

export default App;
