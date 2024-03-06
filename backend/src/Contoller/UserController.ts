import prisma from "../DB/db.config";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";

dotenv.config();

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
        .status(200)
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
    const sessionToken = generateSessionToken();
    const expirationDate = calculateExpirationDate();

    const newUserSession = await prisma.session.create({
      data: {
        sessionToken,
        expires: expirationDate,
        user: { connect: { id: newUser.id } }, // Connect session to the newly created user
      },
    });

    console.log("sdfsdfsdfsdf :", req.session);

    if (!req.session) {
      throw new Error("Session is not initialized");
    }
    req.session.cookie.sessionToken = sessionToken;
    req.session.cookie.user = newUser;

    // Save the session
    req.session.save();
    console.log("sdfsdfsdfsdf 2:", req.session);

    return res.status(200).json({
      data: { newUser, newUserSession },
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
export const loginUser = async (
  req: {
    session: any;
    body: { email: string; password: string; allCookies: any };
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Decrypt the stored password and compare it with the provided password
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SECRET || ""
    ).toString(CryptoJS.enc.Utf8);

    if (password !== decryptedPassword) {
      console.log("Incorrect password");
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }
    console.log("check session while login :", req.session);
    // Expire existing session if it exists
    if (req.session) {
      try {
        // Delete existing session(s) associated with the user ID
        await prisma.session.deleteMany({
          where: {
            userId: req.session.userId,
          },
        });
        console.log(
          "Existing session(s) expired for user:",
          req.session.userId
        );
      } catch (error) {
        console.error("Error expiring existing session(s):", error);
        // Handle error if needed
      }
    }

    // If the user is authenticated, set session variables
    const sessionToken = generateSessionToken();
    console.log("Generated Session Token:", sessionToken);
    const expirationDate = calculateExpirationDate();
    console.log("Expiration Date:", expirationDate);

    const userSession = await prisma.session.create({
      data: {
        sessionToken,
        expires: expirationDate,
        user: { connect: { id: user.id } },
      },
    });

    req.session.sessionToken = sessionToken;
    req.session.user = user;
    req.session.save();

    console.log("check session after login :", req.session);
    return res.status(200).json({
      data: { user, userSession },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
export const userdetail = async (
  req: {
    session: any;
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  try {
    console.log("In userdetail backend", req.session);
    // Fetch user details from the session
    const { user, sessionToken } = req.session.cookie;
    console.log("user", user);
    console.log("sessiontiokern", sessionToken);
    if (!user || !sessionToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Response with user details
    return res.status(200).json({
      name: user.name,
      email: user.email,
      sessionToken: sessionToken,
    });
  } catch (error) {
    console.error("Error fetching user details in backend:", error);
    return res.status(500).json({ message: "Internal server error" });
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
