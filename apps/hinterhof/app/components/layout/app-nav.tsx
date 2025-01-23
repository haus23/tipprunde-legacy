import { Separator, SidebarNav, SidebarTrigger } from '../ui';

export function AppNav() {
  return (
    <SidebarNav>
      <span className="flex items-center gap-x-4">
        <SidebarTrigger className="-mx-2" />
        <Separator className="h-6" orientation="vertical" />
      </span>
    </SidebarNav>
  );
}
