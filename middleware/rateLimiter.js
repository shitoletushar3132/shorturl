import { MAX_REQUESTS, TIME_WINDOW } from "../constant.js";
import client from "../db/redis.js";

export const rateLimiter = async (req, res, next) => {
  const userIP = req.ip;

  try {
    const rateLimitKey = `rateLimit:${userIP}`;

    const currentRequests = await client.incr(rateLimitKey);

    if (currentRequests === 1) {
      await client.expire(rateLimitKey, TIME_WINDOW); // Set expiration to 60 seconds
    }

    console.log(currentRequests);

    if (currentRequests > MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
        message: "You have exceeded the rate limit. Please try again later.",
      });
    }
    next();
  } catch (error) {
    console.error("❌ Error in rate limiter middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
