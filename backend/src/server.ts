import express, { Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
const app = express();
dotenv.config();

// Initialize client.
let redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// Initialize session storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env.SESSION_SECRET || "your-secret-key",
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(async (req, res, next) => {
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
