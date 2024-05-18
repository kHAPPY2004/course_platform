import prisma from "../DB/db.config";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import redisClient from "../DB/redis.config";
import { redisStore } from "../routes/userRoutes";
dotenv.config();

interface RequestBody {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}
export const isUserPresent = async (
  req: {
    body: { email: string };
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        sessions: {
          select: {
            sessionToken: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User found",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};

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

    if (!req.session) {
      return res.status(400).json({ message: "Session is not initialized" });
    }
    req.session.sessionToken = sessionToken;
    req.session.user = newUser;
    req.session.save();

    return res.status(200).json({
      // data: { newUser, newUserSession },
      data: newUser,
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
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
      include: {
        sessions: {
          select: {
            sessionToken: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    // Decrypt the stored password and compare it with the provided password
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SECRET || ""
    ).toString(CryptoJS.enc.Utf8);

    if (password !== decryptedPassword) {
      return res
        .status(200)
        .json({ success: false, message: "Incorrect password" });
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

    return res.status(200).json({
      success: true,
      data: user,
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
export const forgotPassword = async (
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
      include: {
        sessions: {
          select: {
            sessionToken: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
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

    // Explicitly cast the data object to UserCreateInput
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.CRYPTO_SECRET || ""
    ).toString();

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: encryptedPassword },
    });

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

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Password updated and user logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
};
export const logout = async (
  req: {
    sessionID: any;
    body: { email: string };
  },
  res: {
    [x: string]: any;
    status: (code: number) => any;
    json: (data: any) => any;
  }
) => {
  const email = req.body.email;
  const sessionId = req.sessionID;
  const seee = `${redisStore.prefix}${sessionId}`;
  const setemailredis = `${redisStore.prefix}email:${email}`;

  try {
    if (setemailredis && seee && email && sessionId) {
      await redisClient.del(seee);
      await redisClient.del(setemailredis);
      return res.status(200).json({
        success: false, // as when our mission of logout complete then checkuser contain no user so success false
        message: "Logout successfully ...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Logout failed....",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (
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
    // Fetch user details from the session
    const { user, sessionToken } = req.session;
    if (!user || !sessionToken) {
      return res.status(200).json({ success: false, message: "Unauthorized" });
    }
    // Response with user details
    return res
      .status(200)
      .json({ success: true, data: user, message: "you are authorised" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const userPurchases = async (
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
    // Fetch user details from the session
    const { user, sessionToken } = req.session;
    if (!user || !sessionToken) {
      return res.status(200).json({ success: false, message: "Unauthorized" });
    }

    // Attempt to retrieve user purchases from Redis
    const userPurchasesCacheKey = `data:userpurchases:${user.id}`;
    const cachedPurchases = await redisClient.get(userPurchasesCacheKey);
    if (cachedPurchases) {
      const purchases = JSON.parse(cachedPurchases);
      return res.status(200).json({ success: true, data: purchases });
    }

    // If purchases are not found in cache, fetch from the database
    const user_purchases = await prisma.userPurchases.findMany({
      where: {
        userId: user.id,
      },
    });

    // Cache the purchases for future requests
    await redisClient.set(
      userPurchasesCacheKey,
      JSON.stringify(user_purchases)
    );

    return res.status(200).json({ success: true, data: user_purchases });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Function to generate session token
export function generateSessionToken() {
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
export function calculateExpirationDate() {
  const expirationDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  const currentTime = new Date();
  return new Date(currentTime.getTime() + expirationDuration);
}
