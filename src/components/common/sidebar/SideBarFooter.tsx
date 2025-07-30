import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Text from "../text";

const SideBarFooter = () => {
  return (
    <SidebarFooter style={{ 
      padding: '1rem 0.5rem',
      borderTop: '1px solid #e2e8f0'
    }}>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarSeparator style={{ 
            margin: '0.5rem 0',
            borderColor: '#e2e8f0'
          }} />
          <SidebarMenuButton 
            size="lg"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              transition: 'background-color 0.2s ease',
            }}
            className="hover:bg-[#f1f5f9]"
          >
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s"
                alt="profilePicture"
                style={{ 
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              />
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <Text type="caption" style={{ 
                  fontWeight: 500,
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  Ram Thapa
                </Text>
                <Text type="caption" style={{ 
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  Admin
                </Text>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default SideBarFooter;