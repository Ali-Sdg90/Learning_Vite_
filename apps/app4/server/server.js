require("dotenv").config();
const { createApp } = require("./app");
const open = require("open").default;

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // await open(`http://localhost:${PORT}/docs`);
});
