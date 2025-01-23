import {
  IconChevronLgDown,
  IconHome5,
  IconLogout,
  IconSettings,
  IconShield,
  IconTrophy,
} from 'justd-icons';
import { use } from 'react';

import { useSubmit } from 'react-router';
import { signOut } from '#/lib/firebase/auth';
import { useUser } from '#/utils/state/auth';
import { Logo } from '../logo';
import {
  Avatar,
  Menu,
  Sidebar,
  SidebarContent,
  SidebarContext,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarRail,
  SidebarSection,
  SidebarSeparator,
} from '../ui';

const anonymousAvatarUrl = 'https://i.pravatar.cc/300?img=50';

namespace AppSidebar {
  export interface Props extends React.ComponentProps<typeof Sidebar> {}
}

export function AppSidebar({ ...props }: AppSidebar.Props) {
  const submit = useSubmit();

  const ctx = use(SidebarContext);
  const user = useUser();

  async function logoutUser() {
    await signOut();
  }

  function closeSidebar() {
    ctx.isMobile && ctx.isOpenOnMobile && ctx.setIsOpenOnMobile(false);
  }

  return (
    <Sidebar {...props}>
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
      <SidebarContent className="overflow-x-clip">
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
        <SidebarSeparator className="mb-0" />
      </SidebarContent>
      <SidebarFooter>
        <Menu>
          <Menu.Trigger aria-label="Profil" data-slot="menu-trigger">
            <Avatar src={user.photoURL || anonymousAvatarUrl} size="large" />
            <div className="in-data-[sidebar-collapsible=dock]:hidden text-sm">
              {user.displayName || user.email}
              {user.displayName.length > 0 && (
                <span className="-mt-0.5 block text-muted-fg">
                  {user.email}
                </span>
              )}
            </div>
            <IconChevronLgDown className="absolute right-3 in-data-[sidebar-collapsible=dock]:hidden size-4 transition-transform group-pressed:rotate-180" />
          </Menu.Trigger>
          <Menu.Content
            aria-label="User Menu"
            placement="bottom right"
            className="sm:min-w-(--trigger-width)"
          >
            <Menu.Section>
              <Menu.Header separator>
                <span className="block">{user.displayName || user.email}</span>
                {user.displayName.length > 0 && (
                  <span className="font-normal text-muted-fg">
                    {user.email}
                  </span>
                )}
              </Menu.Header>
            </Menu.Section>
            <Menu.Item href="/profil" onAction={closeSidebar}>
              <IconSettings />
              Profil
            </Menu.Item>
            <Menu.Item onAction={logoutUser}>
              <IconLogout />
              Log out
            </Menu.Item>
          </Menu.Content>
        </Menu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
