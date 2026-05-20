import { cn } from "@/lib/utils";
import type { CourseStatus } from "@/types";

const STATUS_MAP: Record<CourseStatus, { label: string; className: string }> = {
  DRAFT:     { label: "แบบร่าง",   className: "badge-draft" },
  IN_REVIEW: { label: "รอตรวจสอบ", className: "badge-review" },
  PUBLISHED: { label: "เผยแพร่แล้ว", className: "badge-free" },
  ARCHIVED:  { label: "เก็บถาวร",  className: "badge-archived" },
};

export function CourseStatusBadge({ status }: { status: CourseStatus }) {
  const { label, className } = STATUS_MAP[status];
  return <span className={cn("badge", className)}>{label}</span>;
}
