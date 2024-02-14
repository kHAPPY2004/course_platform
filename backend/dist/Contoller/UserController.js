"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const db_config_1 = __importDefault(require("../DB/db.config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const findUser = await db_config_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (findUser) {
            console.log("User found");
            return res
                .status(400)
                .json({ success: false, message: "Email already exists" });
        }
        // Explicitly cast the data object to UserCreateInput
        // const encryptedPassword = CryptoJS.AES.encrypt(
        //   password,
        //   process.env.CRYPTO_SECRET || ""
        // ).toString();
        const newUser = await db_config_1.default.user.create({
            data: {
                name,
                email,
                // password: encryptedPassword,
                // phoneNumber,
            },
        });
        return res
            .status(200)
            .json({ data: newUser, message: "User created successfully" });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    finally {
        await db_config_1.default.$disconnect();
    }
};
exports.createUser = createUser;
