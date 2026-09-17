import { AlertCircle, Info, Lightbulb, TriangleAlert } from "lucide-react";

import { cn } from "../lib/utils";

type CalloutType = "info" | "warning" | "tip" | "danger";

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
};

const config = {
  info: {
    icon: Info,
    className: "border-blue-500/30 bg-blue-500/5",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-yellow-500/30 bg-yellow-500/5",
  },
  tip: {
    icon: Lightbulb,
    className: "border-green-500/30 bg-green-500/5",
  },
  danger: {
    icon: AlertCircle,
    className: "border-red-500/30 bg-red-500/5",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const current = config[type];
  const Icon = current.icon;

  return (
    <div
      className={cn("my-6 flex gap-3 rounded-xl border p-4", current.className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />

      <div className="min-w-0 text-sm leading-6">
        {title ? <div className="mb-1 font-semibold">{title}</div> : null}

        <div className="text-muted-foreground [&>p]:m-0">{children}</div>
      </div>
    </div>
  );
}
