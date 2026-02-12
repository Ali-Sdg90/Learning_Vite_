import { useState } from "react";

const App = () => {
    const [counter, setCounter] = useState(0);

    return (
        <div>
            <div>counter {counter}</div>

            <input
                type="button"
                value="Click Me"
                onClick={() => setCounter((prevState) => prevState + 1)}
            />
        </div>
    );
};

export default App;
