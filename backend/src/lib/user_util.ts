import { PrismaClient } from "@prisma/client";
import redisClient from "../DB/redis.config";

const prisma = new PrismaClient();

// Email validation function with domain check
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
  const emailDomain = email.split("@")[1];

  return allowedDomains.includes(emailDomain);
};

// Password validation function
export const isValidPassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation function
export const isValidPhoneNumber = (phoneNumber: string) => {
  const phoneRegex = /^\d{10}$/; // Adjust the regex according to your phone number format requirements
  return phoneRegex.test(phoneNumber);
};

export const fetchUserDetails = async (email: string) => {
  const cacheKey = `data:user:${email}`;

  // Try to get user data from Redis
  const cachedUserDetails = await redisClient.get(cacheKey);
  if (cachedUserDetails) {
    const parsedUserDetails = JSON.parse(cachedUserDetails);
    console.log("Retrieved user information from cache ...");
    return { user: parsedUserDetails };
  }

  // Fetch user data from the database if not in cache
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      sessions: {
        select: { sessionToken: true },
      },
    },
  });

  if (!user) {
    return { user: null };
  }

  console.log("Retrieved user information from database ...");

  // Cache the user details in Redis for future requests
  await redisClient.set(cacheKey, JSON.stringify(user));

  return { user };
};
