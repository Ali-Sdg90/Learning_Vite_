const cors = require("cors");
const express = require("express");

const createApp = (corsOrigin) => {
    const app = express();

    app.use(express.json());
    app.use(
        cors({
            origin: corsOrigin,
        })
    );

    app.get("/api/health", (_req, res) => {
        res.status(200).json({
            ok: true,
            service: "learning-vite-server",
            time: new Date().toISOString(),
        });
    });

    app.get("/test-get", (_req, res) => {
        res.status(200).json({
            ok: true,
            test: "pass",
        });
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
