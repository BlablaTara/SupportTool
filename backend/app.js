import express from 'express';
import homeRouter from "./routes/homeRouter.js"

const app = express();
app.use(express.json());

app.use("/", homeRouter);

const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on: ", PORT));