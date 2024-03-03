import prisma from "../DB/db.config";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import session from "express-session";
import express from "express";
const app = express();
dotenv.config();

// Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
interface RequestBody {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export const createUser = async (
  req: {
    session: any;
    body: RequestBody;
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const findUser = await prisma.user.findUnique({
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
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.CRYPTO_SECRET || ""
    ).toString();

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        phoneNumber,
      },
    });

    // Create a session entry in the database
    const sessionToken = generateSessionToken(); // You need to implement this function
    console.log("Generated Session Token:", sessionToken);
    const expirationDate = calculateExpirationDate();
    console.log("Expiration Date:", expirationDate);

    const newUserSession = await prisma.session.create({
      data: {
        sessionToken,
        expires: expirationDate,
        user: { connect: { id: newUser.id } }, // Connect session to the newly created user
      },
    });
    req.session.sessionToken = sessionToken;
    req.session.userId = newUser.id;
    req.session.user = newUser;

    // Save the session
    req.session.save();
    // await res.cookie("sessionToken", sessionToken, {
    //   expires: expirationDate,
    //   httpOnly: true,
    // });

    return res.status(200).json({
      data: { newUser, newUserSession },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};

// Function to generate session token
function generateSessionToken() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 64;
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

// Function to calculate expiration date for session
function calculateExpirationDate() {
  const expirationDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  const currentTime = new Date();
  return new Date(currentTime.getTime() + expirationDuration);
}
