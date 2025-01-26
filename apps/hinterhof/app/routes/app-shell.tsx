import { Outlet } from 'react-router';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '#/components/layout/app-sidebar';
import { Toaster } from '#/components/ui-justd';
import { UiProvider } from '#/components/ui-provider';

import { AppNav } from '@/components/layout/app-nav';
import { useTeams } from '#/utils/state/teams';

export default function AppShell() {
  // (Pre-) Syncing masterdata
  useTeams();

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
