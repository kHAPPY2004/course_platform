import express, { Request, Response, NextFunction } from "express";
import {
  checkAuth,
  createUser,
  forgotPassword,
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
import {
  sendOtpEmail,
  sendOtpforgotEmail,
  verifyOtp,
  verifyOtpForgot,
} from "../Contoller/emailController";

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
const expiration_email_key = 24 * 60 * 60; // in seconds
const checkExistingSession = async (req: Request, res: Response, next: any) => {
  const email = req.body.email;
  const sessionId = req.sessionID;
  const seee = `${redisStore.prefix}${sessionId}`;
  const setemailredis = `${redisStore.prefix}email:${email}`;

  // get first then set
  const get_exiting_email = await redisClient.get(setemailredis);
  await redisClient.setEx(setemailredis, expiration_email_key, seee);

  if (email && sessionId) {
    try {
      if (get_exiting_email) {
        await redisClient.del(get_exiting_email);
        next();
      } else {
        next();
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    next();
  }
};

router.post("/signup", checkExistingSession, createUser);
router.post("/login", checkExistingSession, loginUser);
router.post("/forgot", checkExistingSession, forgotPassword);
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
router.post("/sendotpforgot", sendOtpforgotEmail);
router.post("/verifyOtp", verifyOtp);
router.post("/verifyOtpforgot", verifyOtpForgot);
router.post("/logout", logout);
// router.get("/courseContent", CourseContent);

export default router;
