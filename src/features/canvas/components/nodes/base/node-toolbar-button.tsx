import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NodeToolbarButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
}

export const NodeToolbarButton = ({
  icon: Icon,
  onClick,
}: NodeToolbarButtonProps) => {
  return (
    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClick}>
      <Icon className="h-4 w-4" />
    </Button>
  );
};
