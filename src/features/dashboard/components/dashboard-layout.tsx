import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopBarActions } from "./top-bar-actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />

        <main className="flex-1">
          <div className="border-b flex justify-between items-center px-6 py-2">
            <DashboardBreadcrumb />
            <TopBarActions />
          </div>

          <div className="">{children}</div>
        </main>
      </TooltipProvider>
    </SidebarProvider>
  );
}
