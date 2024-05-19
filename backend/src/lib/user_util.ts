import { PrismaClient } from "@prisma/client";
import redisClient from "../DB/redis.config";

const prisma = new PrismaClient();

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
