import Nav from "@/components/common/Nav";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/common/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col h-screen overflow-hidden w-full">
        <Nav />
        <SidebarInset className="flex-1 h-screen overflow-auto">
          <div className="p-3 bg-white ">
            <CustomBreadcrumb />
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
