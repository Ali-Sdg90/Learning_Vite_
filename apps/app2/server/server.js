const express = require("express");
const cors = require("cors");
const api = express.Router();
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.listen(PORT, console.log(`App is running on port ${PORT}`));
