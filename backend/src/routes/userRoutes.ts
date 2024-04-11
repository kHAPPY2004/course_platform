import express, { Request, Response, NextFunction } from "express";
import {
  checkAuth,
  createUser,
  loginUser,
  userPurchases,
  userdetail,
} from "../Contoller/UserController";
import {
  addnewCourse,
  coursePurchase,
  getallCourses,
} from "../Contoller/CourseController";
import {
  CourseContent,
  addCourseContent,
  getContentfolder,
} from "../Contoller/ContentController";
import {
  addVideoMetadata,
  getVideoMetadata,
} from "../Contoller/VideoController";

import { createClient } from "redis";
import session from "express-session";
import RedisStore from "connect-redis";

const router = express.Router();

const redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

// Initialize session storage.
router.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env.SESSION_SECRET || "your-secret-key",
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
    genid: function (req) {
      // Use a custom function to generate session ID
      console.log("bnbnbnb*&^*(^&&*(", req.body.email);
      const val = req.body.email;
      // Generate a random string
      const randomString = Math.random();
      return val && val + ":" + randomString; // Change this to generate session ID dynamically
    },
  })
);
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
redisClient.on("ready", () => {
  console.log("client chaluy");
});
const checkExistingSession = async (req: Request, res: Response, next: any) => {
  console.log("reqsdfsfds", req.sessionID);
  const sessionId = req.sessionID;
  const firstArgument = sessionId.split(":")[0];
  console.log("12st", firstArgument);
  const seee = `myapp:${firstArgument}:*`;
  console.log("!!!!!!", seee);

  const existingSessionIdtttt: any = await redisClient.keys(seee);

  if (sessionId) {
    try {
      console.log("existingSessionIdtttt", existingSessionIdtttt);
      if (existingSessionIdtttt) {
        console.log("budding destroy session");
        const dess = await redisClient.del(existingSessionIdtttt);
        console.log("des", dess);
        next();
      } else {
        next();
      }
    } catch (err) {
      console.error("Redis get error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    next();
  }
};
// Handle Redis client "error" event
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

router.post("/signup", createUser);
router.post("/login", checkExistingSession, loginUser);
router.get("/dashboard", userdetail);
router.get("/new-courses", getallCourses);
router.post("/new-courses", addnewCourse); // admin part
router.post("/add-course-content", addCourseContent); // admin part
router.post("/add-video-metadata", addVideoMetadata); // admin part
router.get("/get-videos", getVideoMetadata);
router.post("/course-purchase", coursePurchase);
router.get("/check-auth", checkAuth);
router.get("/userPurchases", userPurchases);
router.get("/getContentfolder", getContentfolder);
router.get("/courseContent", CourseContent);

export default router;
