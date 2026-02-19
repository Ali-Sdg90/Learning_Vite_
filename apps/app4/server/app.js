const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./swagger");

const { tasksRouter } = require("./routes/tasks.routes");
const { errorMiddleware } = require("./middlewares/error.middleware");

function createApp() {
    const app = express();

    app.use(express.json());
    app.use(cors({ origin: process.env.CORS_ORIGIN }));

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use("/api", tasksRouter);

    // 404 fallback
    app.use((_req, res) => {
        res.status(404).json({ ok: false, message: "Route not found" });
    });

    // error handler (always last)
    app.use(errorMiddleware);

    return app;
}

module.exports = { createApp };
