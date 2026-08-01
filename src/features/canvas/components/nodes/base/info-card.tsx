import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InfoCardProps extends HTMLAttributes<HTMLDivElement> {}

export const InfoCard = ({ className, children, ...props }: InfoCardProps) => {
  return (
    <div
      className={cn("rounded-lg border bg-muted/20 p-3", className)}
      {...props}
    >
      {children}
    </div>
  );
};
