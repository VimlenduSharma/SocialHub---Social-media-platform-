import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        {!isMobile && <AppSidebar />}
        
        {/* Mobile Drawer */}
        {isMobile && (
          <MobileDrawer 
            open={mobileDrawerOpen} 
            onOpenChange={setMobileDrawerOpen} 
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <TopNavBar 
            onMobileMenuClick={() => setMobileDrawerOpen(true)}
          />
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
