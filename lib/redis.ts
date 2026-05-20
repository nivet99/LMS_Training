import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const loginRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "ratelimit:login",
});

export const signupRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  prefix: "ratelimit:signup",
});

export const passwordResetRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "ratelimit:password-reset",
});

export const paymentRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "ratelimit:payment",
});

// Cache helpers
export const CACHE_KEYS = {
  courseCatalog: "course:catalog",
  leaderboardPlatform: "leaderboard:platform",
  leaderboardCourse: (id: string) => `leaderboard:course:${id}`,
  searchSuggest: (q: string) => `search:suggest:${q}`,
} as const;

export const CACHE_TTL = {
  courseCatalog: 300,       // 5 min
  leaderboard: 300,          // 5 min
  searchSuggest: 600,        // 10 min
  userSession: 86400,        // 24 hr
} as const;
