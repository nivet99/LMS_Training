interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: "var(--cream-2)" }}
      >
        <span className="text-2xl" style={{ color: "var(--ink-4)" }}>○</span>
      </div>
      <p className="text-h4 font-serif mb-2" style={{ color: "var(--ink)" }}>
        {title}
      </p>
      {description && (
        <p className="text-body-s max-w-sm" style={{ color: "var(--ink-3)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
