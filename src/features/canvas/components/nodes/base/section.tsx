import { ReactNode } from "react";

interface SectionProps {
  title?: string;

  children: ReactNode;
}

export const Section = ({ title, children }: SectionProps) => {
  return (
    <div className="space-y-2">
      {title && (
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
      )}

      {children}
    </div>
  );
};
