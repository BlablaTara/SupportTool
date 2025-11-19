import "dotenv/config";
import express from 'express';
import cors from 'cors';

import homeRouter from "./routes/homeRouter.js"
import headerRouter from "./routes/headerRouter.js"

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use("/", homeRouter);

app.use("/api", headerRouter);

const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on: ", PORT));