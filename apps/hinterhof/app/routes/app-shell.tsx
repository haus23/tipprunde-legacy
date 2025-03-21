import { Outlet } from 'react-router';

import { AppNav } from '@/components/layout/app-nav';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { UiProvider } from '@/components/ui-provider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';

export default function AppShell() {
  return (
    <UiProvider>
      <SidebarProvider>
        <AppSidebar collapsible="icon" />
        <SidebarInset>
          <AppNav />
          <div className="grow p-4 lg:p-6 ">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" />
    </UiProvider>
  );
}
