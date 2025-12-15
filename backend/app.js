// import "dotenv/config";
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

import headerRouter from "./routes/headerRouter.js";
import usersRouter from "./routes/usersRouter.js";
import rolesRouter from "./routes/rolesRouter.js";
import countRouter from "./routes/countRouter.js";
import dropdownRouter from "./routes/dropdownRouter.js";

import collectionsRouter from "./routes/collectionsRouter.js";
import metricsRouter from "./routes/metricsRouter.js";

import pingRouter from "./routes/pingRouter.js";
import serviceRouter from "./routes/serviceRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "..", ".env")
});

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());

app.use("/api", headerRouter);
app.use("/api", usersRouter);
app.use("/api", rolesRouter);
app.use("/api", countRouter);
app.use("/api", dropdownRouter);

app.use("/api", collectionsRouter);
app.use("/api", metricsRouter);

app.use("/api", pingRouter);
app.use("/api", serviceRouter);

const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on: ", PORT));