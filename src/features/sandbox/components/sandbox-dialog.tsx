"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function SandboxDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Your existing Sandbox node/trigger */}
        <button type="button">Open Sandbox</button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="
          fixed inset-0
          h-screen w-screen max-w-none
          translate-x-0 translate-y-0
          gap-0
          rounded-none
          border-0
          p-0
          outline-none
        "
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          {/* Temporary header */}
          <div className="flex h-11 shrink-0 items-center border-b px-4">
            <span className="text-sm font-medium">Sandbox</span>
          </div>

          {/* Workspace */}
          <div className="min-h-0 flex-1">
            {/* Put your existing explorer/editor/terminal here */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
