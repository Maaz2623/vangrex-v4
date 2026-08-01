import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfoRowProps {
  label: string;
  value: ReactNode;

  className?: string;
}

export const InfoRow = ({ label, value, className }: InfoRowProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 text-sm",
        className,
      )}
    >
      <span className="text-muted-foreground">{label}</span>

      <span className="truncate font-medium">{value}</span>
    </div>
  );
};
