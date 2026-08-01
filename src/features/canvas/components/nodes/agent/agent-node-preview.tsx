import { AgentNodeData } from "../types";

interface AgentNodePreviewProps {
  data: AgentNodeData;
}

export const AgentNodePreview = ({ data }: AgentNodePreviewProps) => {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-muted-foreground">Model</p>

        <p className="truncate text-sm font-medium">{data.config.model}</p>

        <div>
          <p className="text-xs text-muted-foreground">Prompt</p>
        </div>

        <p className="line-clamp-3 text-sm">
          {data.config.prompt || "No prompt provided"}
        </p>
      </div>
    </div>
  );
};
