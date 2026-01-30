import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MemberSidebar } from "@/components/dashboard/MemberSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export function MemberLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MemberSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
