const { ZodError } = require("zod");
const { AppError } = require("../utils/AppError");

function errorMiddleware(err, _req, res, _next) {
    // Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            ok: false,
            message: "Validation error",
            details: err.issues.map((i) => ({
                path: i.path.join("."),
                message: i.message,
            })),
        });
    }

    // AppError (custom)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            ok: false,
            message: err.message,
            details: err.details ?? undefined,
        });
    }

    // Unknown errors
    console.error("Unhandled error:", err);
    return res.status(500).json({
        ok: false,
        message: "Internal server error",
    });
}

module.exports = { errorMiddleware };
