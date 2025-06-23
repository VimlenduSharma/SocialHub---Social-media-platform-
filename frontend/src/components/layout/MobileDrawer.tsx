import { Home, Plus, Search, Bell, User, Bookmark, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Feed', url: '/feed', icon: Home },
  { title: 'Create', url: '/create', icon: Plus },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Saved', url: '/saved', icon: Bookmark },
  { title: 'Settings', url: '/settings', icon: Settings },
];

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (url: string) => {
    navigate(url);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span>SocialHub</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-6">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant={location.pathname === item.url ? "default" : "ghost"}
                className="w-full justify-start h-12 text-base"
                onClick={() => handleNavigate(item.url)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.title}
              </Button>
            ))}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
