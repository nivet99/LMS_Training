import type { Role } from "./auth";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  locale: string;
  emailVerified?: Date | null;
  createdAt: Date;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date | null;
  paidAmount?: number | null;
  couponId?: string | null;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  completedAt?: Date | null;
  watchPosition: number;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt?: Date | null;
  calendarDays: boolean[]; // last 7 days, index 0 = oldest
}
