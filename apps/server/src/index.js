const cors = require("cors");
const express = require("express");
const api = express.Router();

const tasks = [
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

let idValue = 3;

const createApp = (corsOrigin) => {
    const app = express();

    app.use(express.json());
    app.use(
        cors({
            origin: corsOrigin,
        })
    );
    app.use("/api", api);

    api.get("/health", (_req, res) => {
        res.status(200).json({
            ok: true,
            service: "learning-vite-server",
            time: new Date().toISOString(),
        });
    });

    api.get("/test-get", (_req, res) => {
        res.status(200).json({
            ok: true,
            test: "pass",
        });
    });

    api.post("/test-post", (req, res) => {
        const { data } = req.body;

        if (!data) {
            res.status(500).json({
                ok: false,
                text: "",
                error: "gime input!",
            });
        } else {
            res.status(200).json({
                ok: true,
                text: `Hello ${data}`,
                error: "",
            });
        }
    });

    // Tasks

    api.get("/tasks", (_req, res) => {
        console.log("server >> get tasks...");

        res.status(200).json({ tasks, ok: true });
    });

    api.post("/tasks", (req, res) => {
        console.log("server >> post tasks...");

        const { title } = req.body;

        if (!title) {
            res.status(400).json({
                ok: false,
                message: "No Title dude!",
            });
        } else {
            tasks.push({
                id: idValue++,
                title,
                done: false,
                createdAt: Date.now(),
            });

            res.status(200).json({
                ok: true,
                message: "Data Added!",
                tasks: tasks,
            });
        }
    });

    api.get("/tasks/:id", (req, res) => {
        console.log("server >> get task by id...");

        const { id } = req.params;

        // console.log("id >> ", id);

        if (!id) {
            res.status(400).json({ ok: false, message: "id is broken sir" });
        }

        const selectedTask = tasks.find((t) => t.id === Number(id - 1));

        console.log("selectedTask >> ", !!selectedTask);

        if (selectedTask) {
            res.status(200).json({
                ok: true,
                task: selectedTask,
                findTask: true,
            });
        } else {
            res.status(404).json({
                ok: true,
                task: "",
                findTask: false,
                message: "Task not found :(",
            });
        }
    });

    return app;
};

const startServer = (port = Number(process.env.PORT) || 3001) => {
    const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
    const app = createApp(corsOrigin);

    return app.listen(port, () => {
        console.log(`API server is running on http://localhost:${port}`);
    });
};

if (require.main === module) {
    startServer();
}

module.exports = {
    createApp,
    startServer,
};
