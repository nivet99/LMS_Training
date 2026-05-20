export function CourseCardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ background: "var(--paper)", borderColor: "var(--line)" }}
    >
      <div className="skeleton" style={{ aspectRatio: "16/10" }} />
      <div className="p-4 space-y-2.5">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-28 rounded" />
        <div className="skeleton h-3 w-16 rounded" />
        <div className="flex justify-between mt-3">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export function CourseGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
