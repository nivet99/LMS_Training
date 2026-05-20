import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import type { Course } from "@/types";

const CATEGORY_THUMB: Record<string, string> = {
  design:    "thumb-design",
  marketing: "thumb-marketing",
  tech:      "thumb-tech",
  finance:   "thumb-finance",
  language:  "thumb-language",
  business:  "thumb-business",
  lifestyle: "thumb-lifestyle",
};

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const thumbClass =
    CATEGORY_THUMB[course.category?.slug ?? ""] ?? "thumb-default";

  const isFree = !course.price || course.price === 0;

  return (
    <Link href={`/courses/${course.slug}`} className="block">
      <article className={cn("plearn-course-card h-full flex flex-col", className)}>
        {/* Thumbnail */}
        <div className="plearn-course-card__thumb">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className={cn("w-full h-full", thumbClass)} />
          )}
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {course.isBestseller && (
              <span className="badge badge-bestseller">Bestseller</span>
            )}
            {course.isNew && !course.isBestseller && (
              <span className="badge badge-new">ใหม่</span>
            )}
            {isFree && <span className="badge badge-free">ฟรี</span>}
          </div>
        </div>

        {/* Body */}
        <div className="plearn-course-card__body flex flex-col flex-1 gap-2">
          {/* Category */}
          {course.category && (
            <span className="text-label" style={{ color: "var(--ink-3)" }}>
              {course.category.name}
            </span>
          )}

          {/* Title */}
          <h3
            className="font-serif font-medium leading-snug"
            style={{ fontSize: "15px", color: "var(--ink)" }}
          >
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-caption" style={{ color: "var(--ink-3)" }}>
            {course.instructor.name}
          </p>

          {/* Rating + enrollment */}
          {course.averageRating !== undefined && (
            <div className="flex items-center gap-1.5">
              <span
                className="font-mono text-sm font-medium"
                style={{ color: "var(--mustard)" }}
              >
                {course.averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 12 12"
                    className="w-3 h-3"
                    fill={i < Math.round(course.averageRating!) ? "var(--mustard)" : "none"}
                    stroke="var(--mustard)"
                    strokeWidth="1"
                  >
                    <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5" />
                  </svg>
                ))}
              </div>
              {course.enrollmentCount !== undefined && (
                <span className="text-caption" style={{ color: "var(--ink-4)" }}>
                  ({formatNumber(course.enrollmentCount)})
                </span>
              )}
            </div>
          )}

          {/* Footer: price */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <span
              className="font-serif font-medium text-h4"
              style={{ color: "var(--ink)" }}
            >
              {isFree
                ? "ฟรี"
                : formatCurrency(course.price!, course.currency)}
            </span>
            {course.lessonCount !== undefined && (
              <span className="text-caption" style={{ color: "var(--ink-4)" }}>
                {course.lessonCount} บทเรียน
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
