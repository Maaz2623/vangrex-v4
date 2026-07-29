import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

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
          <div className="border-b px-8 py-4">
            <DashboardBreadcrumb />
          </div>

          <div className="px-8 py-8">{children}</div>
        </main>
      </TooltipProvider>
    </SidebarProvider>
  );
}
