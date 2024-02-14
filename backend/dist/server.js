"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT;
app.get("/", (req, res) => {
    return res.send("Hello there...");
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//use prisma routes
app.use(index_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
