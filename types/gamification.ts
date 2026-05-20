export type XPReason =
  | "LESSON_COMPLETE"
  | "QUIZ_PASS"
  | "FORUM_POST"
  | "DAILY_LOGIN"
  | "STREAK_7"
  | "STREAK_30"
  | "STREAK_100"
  | "COURSE_COMPLETE";

export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: XPReason;
  referenceId?: string | null;
  createdAt: Date;
}

export type Level = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

export const LEVEL_THRESHOLDS: Record<Level, number> = {
  BRONZE:   0,
  SILVER:   500,
  GOLD:     1500,
  PLATINUM: 3000,
  DIAMOND:  6000,
};

export const XP_REWARDS: Record<XPReason, number> = {
  LESSON_COMPLETE: 10,
  QUIZ_PASS:       20,
  FORUM_POST:       5,
  DAILY_LOGIN:      3,
  STREAK_7:        50,
  STREAK_30:      100,
  STREAK_100:     200,
  COURSE_COMPLETE:  0, // variable based on quiz score bonus
};

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  xp: number;
  level: Level;
}

export function getLevel(xp: number): Level {
  if (xp >= LEVEL_THRESHOLDS.DIAMOND)  return "DIAMOND";
  if (xp >= LEVEL_THRESHOLDS.PLATINUM) return "PLATINUM";
  if (xp >= LEVEL_THRESHOLDS.GOLD)     return "GOLD";
  if (xp >= LEVEL_THRESHOLDS.SILVER)   return "SILVER";
  return "BRONZE";
}
