import express, { Request, Response, NextFunction } from "express";
import {
  checkAuth,
  createUser,
  loginUser,
  logout,
  userPurchases,
} from "../Contoller/UserController";
import {
  addnewCourse,
  coursePurchase,
  getallCourses,
} from "../Contoller/CourseController";
import {
  // CourseContent,
  addCourseContent,
  getContentfolder,
} from "../Contoller/ContentController";
import {
  addVideoMetadata,
  getVideoMetadata,
} from "../Contoller/VideoController";

import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "../DB/redis.config";
import { sendOtpEmail, verifyOtp } from "../Contoller/emailController";

const router = express.Router();

// Initialize store.
export let redisStore = new RedisStore({
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
  })
);

const checkExistingSession = async (req: Request, res: Response, next: any) => {
  const email = req.body.email;
  const sessionId = req.sessionID;
  const seee = `${redisStore.prefix}${sessionId}`;

  // get first then set
  const setemailredis = `${redisStore.prefix}email:${email}`;
  const existingSessionIdtttt: any = await redisClient.get(setemailredis);
  const existingSessionsdfsf = await redisClient.set(setemailredis, seee);
  // Set the expiration time for the key "mykey" to 10 seconds
  await redisClient.expire(email, 24 * 60 * 60);
  console.log(existingSessionsdfsf);

  if (email && sessionId) {
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

router.post("/signup", checkExistingSession, createUser);
router.post("/login", checkExistingSession, loginUser);
router.get("/new-courses", getallCourses);
router.post("/new-courses", addnewCourse); // admin part
router.post("/add-course-content", addCourseContent); // admin part
router.post("/add-video-metadata", addVideoMetadata); // admin part
router.get("/get-videos", getVideoMetadata);
router.post("/course-purchase", coursePurchase);
router.get("/check-auth", checkAuth);
router.get("/userPurchases", userPurchases);
router.get("/getContentfolder", getContentfolder);
router.post("/sendEmail", sendOtpEmail);
router.post("/verifyOtp", verifyOtp);
router.post("/logout", logout);
// router.get("/courseContent", CourseContent);

export default router;
