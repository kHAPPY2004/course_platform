import express, { Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import session from "express-session";
const app = express();
dotenv.config();
// Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: false },
  })
);
app.use((req, res, next) => {
  console.log("Session data:", req.session);
  next();
});
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
