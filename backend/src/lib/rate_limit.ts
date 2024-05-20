import { Request, Response, NextFunction } from "express";
import redisClient from "../DB/redis.config";

const createRateLimiter = (
  durationInSeconds: number,
  numberOfRequestsAllowed: number,
  keyPrefix: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const current_time = Date.now();
    const cacheKey = `${keyPrefix}:${email}`;
    const rate_Exits = await redisClient.hGetAll(cacheKey);

    // Check if the rate limit data exists for the user
    if (Object.keys(rate_Exits).length === 0) {
      await redisClient.hSet(cacheKey, {
        createdAt: current_time.toString(), // Store as string to avoid type issues
        count: "1",
      });
      await redisClient.expire(cacheKey, durationInSeconds); // Set expiration time
      // Add attempts left information in the response
      res.set(
        "X-RateLimit-Attempts-Left",
        (numberOfRequestsAllowed - 1).toString()
      );
      return next();
    }

    const createdAt = parseInt(rate_Exits.createdAt);
    const diff = (current_time - createdAt) / 1000; // Convert to seconds

    // Check if the rate limit duration has passed
    if (diff > durationInSeconds) {
      await redisClient.hSet(cacheKey, {
        createdAt: current_time.toString(),
        count: "1",
      });
      await redisClient.expire(cacheKey, durationInSeconds); // Reset expiration time
      return next();
    }

    const count = parseInt(rate_Exits.count);

    // Check if the user has exceeded the allowed number of requests
    if (count >= numberOfRequestsAllowed) {
      return res.status(429).json({
        success: false,
        message: `Too many requests, please try again after ${
          durationInSeconds / 60
        } minutes`,
      });
    }
    // Calculate attempts left
    const attemptsLeft = numberOfRequestsAllowed - count - 1;

    // Increment the request count
    await redisClient.hSet(cacheKey, {
      count: (count + 1).toString(),
    });

    // Add attempts left information in the response
    res.set("X-RateLimit-Attempts-Left", attemptsLeft.toString());
    // res.set(
    //   "X-RateLimit-Reset",
    //   (createdAt + durationInSeconds * 1000).toString()
    // );
    return next();
  };
};
export default createRateLimiter;
