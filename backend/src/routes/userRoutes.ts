// src/routes/sampleRouter.ts
import express from "express";
import { createUser, loginUser, userdetail } from "../Contoller/UserController";

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
router.post("/", createUser);
// router.post("/signup", createUser);
// router.post("/login", loginUser);
// router.get("/dashboard", isAuthenticated, userdetail);

export default router;
