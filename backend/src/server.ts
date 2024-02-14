import express, { Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
const app = express();
dotenv.config();

const port: number | string | undefined = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  return res.send("Hello there...");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//use prisma routes
app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
