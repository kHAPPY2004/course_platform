import { Request, Response } from "express";
import nodemailer from "nodemailer";
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

// Function to send email
export const sendOtpEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required", success: false });
  }

  const otp = generateOtp();
  console.log("generated otp---", otp);
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
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return res
      .status(200)
      .json({ message: "OTP sent successfully", success: true, data: otp });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ message: "Failed to send OTP", success: false });
  }
};
