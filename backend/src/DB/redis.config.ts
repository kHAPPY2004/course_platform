import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
redisClient.on("ready", () => {
  console.log("client chaluy");
});

export default redisClient;
