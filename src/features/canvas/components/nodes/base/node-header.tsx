import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NodeHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  rightSection?: ReactNode;
  className?: string;
}

export const NodeHeader = ({
  icon,
  title,
  subtitle,
  rightSection,
  className,
}: NodeHeaderProps) => {
  return (
    <div
      className={cn(
        "flex items-start justify-between ga-3 border-b px-4 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3 ">
        <div className="flex h-10 shrink-0 p-2 items-center justify-center rounded-lg border bg-muted">
          {icon}
        </div>

        <div className="min-w-0 ">
          <h3 className="truncate text-sm font-semibold">{title}</h3>

          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {rightSection && <div className="shrink-0">{rightSection}</div>}
    </div>
  );
};
