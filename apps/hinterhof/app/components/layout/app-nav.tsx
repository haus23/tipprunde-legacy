import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { Breadrumbs } from './breadcrumps';

export function AppNav() {
  return (
    <header className="flex h-16 shrink-0 translate-y-[1px] items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadrumbs />
      </div>
    </header>
  );
}
