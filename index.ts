import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const cors = require("cors");
const userRouter = require("./routes/UserRouter");
const queryRouter = require("./routes/queryRouter");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api/user" , userRouter)
app.use("/api/query" , queryRouter)

app.get("/", (req: Request, res: Response) => {
  res.send("Database Visualization");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});