// src/routes/sampleRouter.ts
import express from "express";
import { createUser } from "../Contoller/UserController";

const router = express.Router();

router.post("/", createUser);

export default router;
