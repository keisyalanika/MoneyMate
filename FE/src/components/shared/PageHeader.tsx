import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">{title}</h2>
        <p className="text-xs text-subtle">{subtitle}</p>
      </div>
      {action && <div className="flex shrink-0">{action}</div>}
    </div>
  );
}
