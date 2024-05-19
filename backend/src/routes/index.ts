import express from "express";
import userRoutes from "./userRoutes";
const router = express.Router();

router.use("/api", userRoutes);

export default router;
