
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, ".env"),
});

const { default: connectdb } = await import("./config/db.js");
const { default: router } = await import("./routes/agent.route.js");

const app = express();
const port = process.env.PORT || 8003;

app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
    res.json({ message: "Hello from agent" });
});

app.listen(port, () => {
    console.log(`Agent started at port ${port}`);
    connectdb();
});
