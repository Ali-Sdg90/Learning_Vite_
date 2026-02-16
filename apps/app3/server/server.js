require("dotenv").config();
const express = require("express");
const cors = require("cors");
const api = express.Router();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use("/api", api);

let tasks = [
    {
        id: 0,
        title: "Ali Sadeghi",
        done: true,
        createdAt: Date.now(),
    },
    {
        id: 1,
        title: "Learn Vite",
        done: false,
        createdAt: Date.now(),
    },
    {
        id: 2,
        title: "Some Random Task",
        done: false,
        createdAt: Date.now(),
    },
];

api.get("/tasks", (_req, res) => {
    console.log("GET Request");

    res.status(200).json(tasks);
});

api.post("/tasks", (req, res) => {
    console.log("POST Request");

    const { data } = req.body;

    tasks.push({
        id: tasks[tasks.length - 1].id + 1,
        title: data.title,
        done: data.done,
        createdAt: Date.now(),
    });

    res.status(201).json({
        ok: true,
        task: tasks[tasks.length - 1],
    });
});

api.get("/tasks/:id", (req, res) => {
    console.log("GET With ID Request");
    const { id } = req.params;

    // res.status(200).json({ ok: true, id });

    const findTask = tasks.find((task) => task.id === +id);

    if (findTask) {
        res.status(200).json({ ok: true, task: findTask });
    } else {
        res.status(404).json({ ok: false, text: "Task not found!" });
    }
});

api.patch("/tasks/:id", (req, res) => {
    console.log("PATCH Request");

    const { data } = req.body;
    const { id } = req.params;

    const findTask = tasks.find((task) => task.id === +id);

    if (!findTask) {
        return res.status(404).json({ ok: false, text: "Task not found!" });
    }

    if (typeof data.title === "string") {
        findTask.title = data.title;
    }

    res.status(200).json({ ok: true, task: findTask });
});

api.delete("/tasks/:id", (req, res) => {
    const id = +req.params.id;

    const findIndex = tasks.findIndex((task) => task.id === id);

    console.log(">>", findIndex);

    if (findIndex === -1) {
        return res.status(404).json({ ok: false, text: "Task not found!" });
    }

    tasks.splice(findIndex, 1);

    res.status(200).json({ ok: true, text: "Task deleted successfully!" });
});

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
