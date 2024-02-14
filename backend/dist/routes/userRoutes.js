"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/sampleRouter.ts
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../Contoller/UserController");
const router = express_1.default.Router();
router.post("/", UserController_1.createUser);
exports.default = router;
