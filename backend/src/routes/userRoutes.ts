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

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/dashboard", userdetail);
router.get("/new-courses", getallCourses);
router.post("/new-courses", addnewCourse); // admin part
router.post("/add-course-content", addCourseContent); // admin part
router.post("/course-purchase", coursePurchase);
router.get("/check-auth", checkAuth);
router.get("/userPurchases", userPurchases);
router.get("/getContentfolder", getContentfolder);
router.get("/courseContent", CourseContent);

export default router;
