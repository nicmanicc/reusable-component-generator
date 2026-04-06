import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  prefix: "ratelimit:auth",
});

export const generationRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "1 d"),
  prefix: "ratelimit:generation",
});
