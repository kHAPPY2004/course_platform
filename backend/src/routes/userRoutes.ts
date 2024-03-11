// src/routes/sampleRouter.ts
import express from "express";
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
// check user is authenticated or not
const isAuthenticated = (req: { session: any }, res: any, next: any) => {
  class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }
  const { userId, user, sessionToken }: any = req.session;
  if (!userId || !user || !sessionToken) {
    const err = new CustomError("you shall not pass", 401);
    next(err);
  }
  next();
};

const router = express.Router();
// router.post("/", createUser);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/dashboard", userdetail);
router.get("/new-courses", getallCourses);
router.post("/new-courses", addnewCourse);
router.post("/course-purchase", coursePurchase);
router.get("/check-auth", checkAuth);
router.get("/userPurchases", userPurchases);

export default router;
