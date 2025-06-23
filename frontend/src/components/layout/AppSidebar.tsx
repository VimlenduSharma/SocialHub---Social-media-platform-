import { Home, Plus, Search, Bell, User, Heart, Bookmark, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Feed', url: '/feed', icon: Home },
  { title: 'Create', url: '/create', icon: Plus },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Saved', url: '/saved', icon: Bookmark },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-xl">SocialHub</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="w-full justify-start h-12 text-base font-medium hover:bg-accent/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  >
                    <button onClick={() => navigate(item.url)}>
                      <item.icon className="h-6 w-6" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate('/edit-profile')}
        >
          <User className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
