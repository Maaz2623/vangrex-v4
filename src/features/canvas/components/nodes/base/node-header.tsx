import { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "flex items-center justify-between border-b bg-muted/30 px-4 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold leading-none">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">{rightSection}</div>
    </div>
  );
};
