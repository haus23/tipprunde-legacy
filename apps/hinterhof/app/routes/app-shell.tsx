import { Outlet } from 'react-router';

import { AppNav } from '#/components/layout/app-nav';
import { AppSidebar } from '#/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '#/components/ui';
import { UiProvider } from '#/components/ui-provider';

import { useTeams } from '#/utils/state/teams';

export default function AppShell() {
  // (Pre-) Syncing masterdata
  useTeams();

  return (
    <UiProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppNav />
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UiProvider>
  );
}
