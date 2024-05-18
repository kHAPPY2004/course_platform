import { Request, Response } from "express";
import nodemailer from "nodemailer";
import redisClient from "../DB/redis.config";
import prisma from "../DB/db.config";
import { redisStore } from "../routes/userRoutes";
import dotenv from "dotenv";
dotenv.config();

// Function to generate a random OTP
function generateOtp(length: number = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // Generates a random digit
  }
  return otp;
}

const OTP_EXPIRATION_TIME = 3 * 60; // 2 minutes in seconds
// Function to send email
export const sendOtpEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (findUser) {
    return res
      .status(200)
      .json({ success: false, message: "Email already exists" });
  }

  const otp = generateOtp();
  console.log("gerated otp", otp);
  // Store the OTP and expiration time in Redis
  const setemailredis = `${redisStore.prefix}otpsignup:${email}`;
  await redisClient.setEx(setemailredis, OTP_EXPIRATION_TIME, otp);

  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service provider
    auth: {
      user: process.env.SMTP_MAIL, // Your email address
      pass: process.env.SMTP_PASWORD, // Your email password (or an app-specific password if using 2FA)
    },
  });

  // Set up email data
  let mailOptions = {
    // from: process.env.SMTP_MAIL, // Sender address
    from: `"Khappy" <${process.env.SMTP_MAIL}>`, // Sender address
    to: email, // List of receivers
    subject: "Your OTP Code", // Subject line
    text: `Your OTP code is ${otp}`, // Plain text body
    html: `<p>Your OTP code is <strong>${otp}</strong></p>`, // HTML body
  };

  // Send mail with defined transport object
  try {
    let info = await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to send OTP", success: false });
  }
};
export const sendOtpforgotEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!findUser) {
    return res.status(200).json({ success: false, message: "User Not Found" });
  }

  const otp = generateOtp();
  console.log("generated otp", otp);
  // Store the OTP and expiration time in Redis
  const setemailredis = `${redisStore.prefix}otpforgot:${email}`;
  await redisClient.setEx(setemailredis, OTP_EXPIRATION_TIME, otp);

  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service provider
    auth: {
      user: process.env.SMTP_MAIL, // Your email address
      pass: process.env.SMTP_PASWORD, // Your email password (or an app-specific password if using 2FA)
    },
  });

  // Set up email data
  let mailOptions = {
    // from: process.env.SMTP_MAIL, // Sender address
    from: `"Khappy" <${process.env.SMTP_MAIL}>`, // Sender address
    to: email, // List of receivers
    subject: "Your OTP Code", // Subject line
    text: `Your OTP code is ${otp}`, // Plain text body
    html: `<p>Your OTP code is <strong>${otp}</strong></p>`, // HTML body
  };

  // Send mail with defined transport object
  try {
    let info = await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to send OTP", success: false });
  }
};
// Function to verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .json({ message: "Email and OTP are required", success: false });
  }

  // Retrieve the OTP from Redis
  const setemailredis = `${redisStore.prefix}otpsignup:${email}`;
  const storedOtp = await redisClient.get(setemailredis);
  if (!storedOtp) {
    return res
      .status(400)
      .json({ message: "OTP expired or not found", success: false });
  }

  if (otp !== storedOtp) {
    return res.status(200).json({ message: "Invalid OTP", success: false });
  }

  // OTP is valid, optionally delete the OTP after successful verification
  await redisClient.del(email);

  return res
    .status(200)
    .json({ message: "OTP verified successfully", success: true });
};

export const verifyOtpForgot = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .json({ message: "Email and OTP are required", success: false });
  }

  // Retrieve the OTP from Redis
  const setemailredis = `${redisStore.prefix}otpforgot:${email}`;
  const storedOtp = await redisClient.get(setemailredis);
  if (!storedOtp) {
    return res
      .status(400)
      .json({ message: "OTP expired or not found", success: false });
  }

  if (otp !== storedOtp) {
    return res.status(200).json({ message: "Invalid OTP", success: false });
  }

  // OTP is valid, optionally delete the OTP after successful verification
  await redisClient.del(email);

  return res
    .status(200)
    .json({ message: "OTP verified successfully", success: true });
};
