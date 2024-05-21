import { Request, Response } from "express";
import nodemailer from "nodemailer";
import redisClient from "../DB/redis.config";
import prisma from "../DB/db.config";
import { redisStore } from "../routes/userRoutes";
import dotenv from "dotenv";
import {
  calculateExpirationDate,
  generateSessionToken,
} from "../lib/gen_session";
import { fetchUserDetails } from "../lib/user_util";

dotenv.config();

// Function to generate a random OTP
function generateOtp(length: number = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random digit
  }
  return otp;
}

// Function to create transporter
export const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // Use your email service provider
    auth: {
      user: process.env.SMTP_MAIL, // Your email address
      pass: process.env.SMTP_PASSWORD, // Your email password (or an app-specific password if using 2FA)
    },
  });
};

// Function to create mail options
export const createMailOptions = (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  return {
    from: `"Khappy" <${process.env.SMTP_MAIL}>`, // Sender address
    to, // List of receivers
    subject, // Subject line
    text, // Plain text body
    html, // HTML body
  };
};

const OTP_EXPIRATION_TIME = 3 * 60; // 3 minutes in seconds
const UNIQUE_EXPIRATION_TIME = 3 * 60; // 3 minutes in seconds
// Function to send email
export const sendOtp_signup = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    const { user } = await fetchUserDetails(email);

    if (user) {
      return res
        .status(200)
        .json({ success: false, message: "Email already exists" });
    }

    const otp = generateOtp();
    console.log("gerated otp", otp);

    // Store the OTP and expiration time in Redis
    const setotpredis = `${redisStore.prefix}otpsignup:${email}`;
    await redisClient.setEx(setotpredis, OTP_EXPIRATION_TIME, otp);

    const transporter = createTransporter();
    const mailOptions = createMailOptions(
      email,
      "Your OTP Code",
      `Your OTP code is ${otp}`,
      `<p>Your OTP code is <strong>${otp}</strong></p>`
    );

    // Send mail with defined transport object
    try {
      // await transporter.sendMail(mailOptions);
      return res
        .status(200)
        .json({ message: "OTP sent successfully", success: true });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to send OTP", success: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  } finally {
    await prisma.$disconnect();
  }
};
export const sendOtp_login_forgot_Email = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }
    const { user } = await fetchUserDetails(email);

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User Not Found" });
    }

    // Generate a unique key
    const uniqueKey = `uid_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // Store the unique key in Redis with an appropriate expiration time if needed
    const uniqueKeyRedisKey = `${redisStore.prefix}unique_key_sendOtp:${email}`;

    await redisClient.setEx(
      uniqueKeyRedisKey,
      UNIQUE_EXPIRATION_TIME,
      uniqueKey
    );

    const otp = generateOtp();
    console.log("generated otp", otp);

    // Store the OTP and expiration time in Redis
    const setotpfl = `${redisStore.prefix}otpforgot_login:${email}`;
    await redisClient.setEx(setotpfl, OTP_EXPIRATION_TIME, otp);

    const transporter = createTransporter();

    const mailOptions = createMailOptions(
      email,
      "Your OTP Code",
      `Your OTP code is ${otp}`,
      `<p>Your OTP code is <strong>${otp}</strong></p>`
    );

    // Send mail with defined transport object
    try {
      // await transporter.sendMail(mailOptions);
      return res.status(200).json({
        message: "OTP sent successfully",
        success: true,
        key: uniqueKey,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to send OTP", success: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  } finally {
    await prisma.$disconnect();
  }
};

// Function to verify OTP
export const verifyOtp_signup = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required", success: false });
    }
    const { user } = await fetchUserDetails(email);

    if (user) {
      return res
        .status(200)
        .json({ success: false, message: "Email already exists" });
    }

    // Retrieve the OTP from Redis
    const getotpredis = `${redisStore.prefix}otpsignup:${email}`;
    const storedOtp = await redisClient.get(getotpredis);
    if (!storedOtp) {
      return res
        .status(401)
        .json({ message: "OTP expired or not found", success: false });
    }

    if (otp !== storedOtp) {
      return res.status(200).json({ message: "Invalid OTP", success: false });
    }

    // OTP is valid, optionally delete the OTP after successful verification
    await redisClient.del(getotpredis);

    // Generate a unique key
    const uniqueKey = `uid_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // Store the unique key in Redis with an appropriate expiration time
    const uniqueKeyRedisKey = `${redisStore.prefix}unique_key_verifyOtp_signup:${email}`;

    await redisClient.setEx(
      uniqueKeyRedisKey,
      UNIQUE_EXPIRATION_TIME,
      uniqueKey
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      key: uniqueKey,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  } finally {
    await prisma.$disconnect();
  }
};

export const verifyOtpForgot = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required", success: false });
    }
    const { user } = await fetchUserDetails(email);

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User Not Found" });
    }

    // Retrieve the OTP from Redis
    const otpgetfromredis = `${redisStore.prefix}otpforgot_login:${email}`;
    const storedOtp = await redisClient.get(otpgetfromredis);
    if (!storedOtp) {
      return res
        .status(401)
        .json({ message: "OTP expired or not found", success: false });
    }

    if (otp !== storedOtp) {
      return res.status(200).json({ message: "Invalid OTP", success: false });
    }

    // OTP is valid, optionally delete the OTP after successful verification
    await redisClient.del(otpgetfromredis);

    // Generate a unique key
    const uniqueKey = `uid_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // Store the unique key in Redis with an appropriate expiration time if needed
    const uniqueKeyRedisKey = `${redisStore.prefix}unique_key_verifyOtpForgot:${email}`;

    await redisClient.setEx(
      uniqueKeyRedisKey,
      UNIQUE_EXPIRATION_TIME,
      uniqueKey
    );
    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      key: uniqueKey,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  } finally {
    await prisma.$disconnect();
  }
};

export const verifyOtpandLogin = async (
  req: {
    session: any;
    body: {
      email: string;
      unique_key_sendOtp: string;
      otp: string;
      allCookies: any;
    };
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  try {
    const { email, otp, unique_key_sendOtp } = req.body;
    if (!email || !otp || !unique_key_sendOtp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required", success: false });
    }

    //login process
    const { user } = await fetchUserDetails(email);

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    // Get Unique key from redis
    const uniqueKeyRedisKey = `${redisStore.prefix}unique_key_sendOtp:${email}`;
    const uniq_key = await redisClient.get(uniqueKeyRedisKey);
    // Verify unique key
    if (uniq_key === unique_key_sendOtp) {
      // key verified then no need of key in redis so delete it
      await redisClient.del(uniqueKeyRedisKey);
    } else {
      return res.status(400).json({
        message: "Session Expired , Please try again from initial step",
        success: false,
      });
    }

    // Retrieve the OTP from Redis
    const otpgetfromredis = `${redisStore.prefix}otpforgot_login:${email}`;
    const storedOtp = await redisClient.get(otpgetfromredis);
    if (!storedOtp) {
      return res
        .status(401)
        .json({ message: "OTP expired or not found", success: false });
    }

    if (otp !== storedOtp) {
      return res.status(200).json({ message: "Invalid OTP", success: false });
    }

    // Expire existing session if it exists
    if (user.sessions.length > 0) {
      try {
        // Delete existing session(s) associated with the user ID
        await prisma.session.deleteMany({
          where: {
            userId: user.id,
          },
        });
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    // If the user is authenticated, set session variables
    const sessionToken = generateSessionToken();
    const expirationDate = calculateExpirationDate();

    await prisma.session.create({
      data: {
        sessionToken,
        expires: expirationDate,
        user: { connect: { id: user.id } },
      },
    });

    req.session.sessionToken = sessionToken;
    req.session.user = user;
    req.session.save();

    // OTP is valid, optionally delete the OTP after successful verification
    await redisClient.del(otpgetfromredis);

    return res.status(200).json({
      message: "OTP verified and Login Successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  } finally {
    await prisma.$disconnect();
  }
};
