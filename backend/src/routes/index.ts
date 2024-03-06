import express from "express";
import userRoutes from "./userRoutes";
const router = express.Router();

router.use("/api", userRoutes);
// router.use("/api/signup", userRoutes);

export default router;
