import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";
import small_Logo from "@/assets/small-logo.png";

type SideBarHeaderProps = {
  isCollapsed: boolean;
};

export const SideBarHeader = ({ isCollapsed }: SideBarHeaderProps) => {
  return (
    <SidebarHeader
      style={{
        padding: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'transform 0.2s ease',
              }}
            >
              <img
                src={isCollapsed ? small_Logo : logo}
                alt="Logo"
                style={{
                  width: isCollapsed ? '40px' : '140px',
                  height: 'auto',
                  objectFit: 'contain',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
