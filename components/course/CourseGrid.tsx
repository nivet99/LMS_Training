import { CourseCard } from "./CourseCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Course } from "@/types";
import Link from "next/link";

interface CourseGridProps {
  courses: Course[];
  columns?: 3 | 4;
}

export function CourseGrid({ courses, columns = 4 }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <EmptyState
        title="ยังไม่มีคอร์ส"
        description="ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น"
        action={
          <Link href="/courses" className="plearn-btn plearn-btn-solid">
            ดูคอร์สทั้งหมด
          </Link>
        }
      />
    );
  }

  return (
    <div
      className={
        columns === 4
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      }
    >
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
