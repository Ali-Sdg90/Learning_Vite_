import { useState } from "react";
import axios from "axios";
import errorHandler from "../utils/errorHandler";

const App = () => {
    const [counter, setCounter] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [newTaskValue, setNewTaskValue] = useState("");
    const [searchTasksValue, setSearchTasksValue] = useState("");
    const [searchedTask, setSearchedTask] = useState("");
    const [tasks, setTasks] = useState([]);

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

    const getTasks = async () => {
        try {
            console.log("get tasks...");

            const res = await axios.get("/api/tasks");

            console.log("your tasks has been loaded", res.data);
            if (res?.data && res?.data?.ok) {
                setTasks(res.data.tasks);
                console.log("tasks >> ", res.data.tasks);
            }
        } catch (error) {
            errorHandler(error);
        }
    };

    const addNewTask = async () => {
        try {
            console.log("post tasks...");

            if (!newTaskValue) {
                console.log("Get error from server :D");
            }

            const res = await axios.post("/api/tasks", { title: newTaskValue });

            if (res?.data && res?.data?.ok) {
                console.log("your tasks has been added");
            }
        } catch (error) {
            errorHandler(error);
        }
    };

    const searchTask = async () => {
        try {
            console.log("search tasks...");

            if (!searchTasksValue) {
                console.log("Get error from server :D");
            }

            const res = await axios.get(`/api/tasks/${searchTasksValue}`);

            if (res?.data && res?.data?.ok && res?.data?.findTask) {
                setSearchedTask({ title: res.data.task.title, id: searchTasksValue });
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

            {/* Tasks */}

            <h2>Tasks</h2>

            {tasks.map((task, index) => (
                <div key={index}>
                    {index + 1}. {task.title}
                </div>
            ))}

            <button onClick={getTasks}>Get Tasks</button>

            <br />
            <span>Add New Task: </span>
            <input
                type="text"
                value={newTaskValue}
                onChange={(e) => setNewTaskValue(e.target.value)}
            />
            <button onClick={addNewTask}>Add</button>

            <br />
            <input
                type="text"
                value={searchTasksValue}
                onChange={(e) => setSearchTasksValue(e.target.value)}
            />
            <button onClick={searchTask}>Get Your Task</button>

            {searchedTask.id && (
                <div>
                    {searchedTask.id}. {searchedTask.title}
                </div>
            )}
        </div>
    );
};

export default App;
