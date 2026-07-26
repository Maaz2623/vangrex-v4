import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { NodeHandles } from "./node-handles";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
};

export const BaseNode = ({ icon, title, description, children }: Props) => {
  return (
    <Card className="relative min-w-[280px] overflow-visible rounded-xl border border-border bg-card shadow-lg">
      <NodeHandles />

      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>

          <div>
            <h3 className="text-sm font-semibold">{title}</h3>

            {description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* {badge} */}
      </div>

      {children && <div className="space-y-3 p-4">{children}</div>}
    </Card>
  );
};
