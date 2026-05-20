export type CourseStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type CourseLevel  = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
export type LessonType   = "VIDEO" | "PDF" | "TEXT" | "QUIZ" | "SCORM" | "EMBED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface Instructor {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructorId: string;
  instructor: Instructor;
  categoryId?: string | null;
  category?: Category | null;
  price?: number | null;
  currency: string;
  status: CourseStatus;
  language: string;
  level: CourseLevel;
  thumbnail?: string | null;
  publishAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // computed
  averageRating?: number;
  enrollmentCount?: number;
  totalDuration?: number; // seconds
  lessonCount?: number;
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  type: LessonType;
  order: number;
  duration?: number | null;
  isFree: boolean;
  muxAssetId?: string | null;
  muxPlaybackId?: string | null;
  s3Key?: string | null;
  content?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseWithChapters extends Course {
  chapters: Chapter[];
}
