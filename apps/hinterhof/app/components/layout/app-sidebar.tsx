import { IconHome5, IconShield, IconTrophy } from 'justd-icons';
import { use } from 'react';

import { Logo } from '../logo';
import {
  Link,
  Sidebar,
  SidebarContent,
  SidebarContext,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarRail,
  SidebarSection,
  SidebarSeparator,
} from '../ui';

namespace AppSidebar {
  export interface Props extends React.ComponentProps<typeof Sidebar> {}
}

export function AppSidebar({
  collapsible = 'dock',
  ...props
}: AppSidebar.Props) {
  const ctx = use(SidebarContext);

  function closeSidebar() {
    ctx.isMobile && ctx.isOpenOnMobile && ctx.setIsOpenOnMobile(false);
  }

  return (
    <Sidebar collapsible={collapsible} {...props}>
      <SidebarHeader className="mb-1.5">
        <a
          href="https://www.runde.tips"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-x-2 group-data-[collapsible=dock]:size-10 group-data-[collapsible=dock]:justify-center"
          onClick={closeSidebar}
        >
          <Logo className="size-5" />
          <SidebarLabel className="font-medium">runde.tips</SidebarLabel>
        </a>
      </SidebarHeader>
      <SidebarContent className="overflow-y-clip">
        <SidebarSeparator className="mt-0" />
        <SidebarSection className="grow">
          <SidebarItem href="/" onPress={closeSidebar} tooltip="Dashboard">
            <IconHome5 className="size-5" />
            <SidebarLabel>Dashboard</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSeparator />
        <SidebarSection title="Stammdaten">
          <SidebarItem
            href="/turniere"
            onPress={closeSidebar}
            tooltip="Turniere"
          >
            <IconTrophy />
            <SidebarLabel>Turniere</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/teams" onPress={closeSidebar} tooltip="Teams">
            <IconShield />
            <SidebarLabel>Teams</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSection />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
