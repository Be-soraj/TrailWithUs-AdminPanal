import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { type ComponentType } from "react";
import SideBarFooter from "./SideBarFooter";
import { menuList } from "@/constant/menuList";
import { SideBarHeader } from "./SideBarHeader";
import { Link, useLocation } from "react-router-dom";

interface menuItem {
  title: string;
  url: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar(); 
  const isCollapsed = state === "collapsed"; 

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(`${url}/`);
  };

  return (
    <Sidebar collapsible="icon" className="bg-slate-50 border-r border-slate-200">
      <SideBarHeader isCollapsed={isCollapsed} />

      <SidebarContent>
        {menuList.map((item: menuItem) => {
          const active = isActive(item.url);
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={`w-full p-2 rounded-md flex items-center gap-3 transition-colors duration-200 ${
                        active
                          ? "bg-slate-200 font-semibold text-slate-800"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3 w-full">
                        <item.icon size={20} className="shrink-0 text-slate-600" />
                        <span className="text-sm truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SideBarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
