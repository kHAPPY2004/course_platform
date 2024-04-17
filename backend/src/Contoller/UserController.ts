import prisma from "../DB/db.config";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import redisClient from "../DB/redis.config";
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
    req.session.sessionToken = sessionToken;
    req.session.user = newUser;

    // Save the session
    req.session.save();
    console.log("sdfsdfsdfsdf 2:", req.session);

    return res.status(200).json({
      data: { newUser, newUserSession },
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
    console.log("user in loginuser: ", user);
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
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }
    console.log("check session while login :", req.session);
    // Expire existing session if it exists
    if (user.sessions.length > 0) {
      try {
        console.log("delete the purna session from database");
        // Delete existing session(s) associated with the user ID
        await prisma.session.deleteMany({
          where: {
            userId: user.id,
          },
        });
      } catch (error) {
        console.error("Error expiring existing session(s):", error);
        // Handle error if needed
      }

      // try {
      //   const redisClient = createClient();
      //   redisClient.connect().catch(console.error);
      //   console.log("redis client added: ");
      //   // Loop through existing sessions and delete them from Redis
      //   const ans: any = await redisClient.get(
      //     `myapp:3MQpKpaUw5fqb5XTYcYDROTuzIFQSKSz`
      //   );

      //   if (ans.user.email == email) {
      //     console.log("delete the toek");
      //     await redisClient.del(`myapp:3MQpKpaUw5fqb5XTYcYDROTuzIFQSKSz`);
      //   }

      //   redisClient.quit();
      // } catch (error) {
      //   console.error("Error deleting existing session(s):", error);
      //   // Handle error if needed
      // }
    }

    // If the user is authenticated, set session variables
    const sessionToken = generateSessionToken();
    const expirationDate = calculateExpirationDate();

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
      success: true,
      // data: { user, userSession },
      user,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
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
      .json({ success: true, user, message: "you are authorised" });
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
    const userPurchasesCacheKey = `user:${user.id}:purchases`;
    const cachedPurchases = await redisClient.get(userPurchasesCacheKey);
    if (cachedPurchases) {
      const purchases = JSON.parse(cachedPurchases);
      console.log("Retrieved user purchases from cache", purchases);
      return res.status(200).json({ success: true, data: purchases });
    }

    // If purchases are not found in cache, fetch from the database
    const user_purchases = await prisma.userPurchases.findMany({
      where: {
        userId: user.id,
      },
    });
    console.log("Retrieved user purchases from database", user_purchases);

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
