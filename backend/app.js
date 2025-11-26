// import "dotenv/config";
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

import homeRouter from "./routes/homeRouter.js";
import headerRouter from "./routes/headerRouter.js";
import usersRouter from "./routes/usersRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "..", ".env")
});

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use("/", homeRouter);

app.use("/api", headerRouter);

app.use("/api", usersRouter);

const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on: ", PORT));