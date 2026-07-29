"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BadgeQuestionMarkIcon, BellIcon, SunIcon } from "lucide-react";

export const TopBarActions = () => {
  return (
    <div className="flex gap-x-2">
      <Separator orientation="vertical" />
      <Button variant={`ghost`} size={`icon`}>
        <SunIcon />
      </Button>
      <Button variant={`ghost`} size={`icon`}>
        <BellIcon />
      </Button>
      <Button variant={`ghost`} size={`icon`}>
        <BadgeQuestionMarkIcon />
      </Button>
    </div>
  );
};
