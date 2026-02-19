const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Tasks API",
            version: "1.0.0",
            description: "Simple Tasks API with Express + Zod",
        },
        servers: [{ url: "http://localhost:3000" }],
    },

    apis: [path.join(__dirname, "/routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };
