import {
  CalendarIcon,
  ChevronsUpDown,
  DicesIcon,
  FoldersIcon,
  HomeIcon,
  LogOutIcon,
  type LucideIcon,
  PilcrowIcon,
  ScaleIcon,
  SettingsIcon,
  ShieldIcon,
  Table2Icon,
  TicketPlusIcon,
  TrophyIcon,
  UsersIcon,
} from 'lucide-react';
import { Link, NavLink } from 'react-router';

import { signOut } from '@/lib/firebase/auth';
import { useUser } from '@/utils/state/auth';
import { useOptionalChampionship } from '@/utils/state/current-championship/championship';

import { Logo } from '../logo';
import { Avatar, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '../ui/sidebar';

const anonymousAvatarUrl = 'https://i.pravatar.cc/300?img=50';

const currentDataItems: {
  title: string;
  url: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Turnier',
    url: '/turnier',
    icon: TrophyIcon,
  },
  {
    title: 'Spiele',
    url: '/spiele',
    icon: CalendarIcon,
  },
  {
    title: 'Tipps',
    url: '/tipps',
    icon: DicesIcon,
  },
  {
    title: 'Ergebnisse',
    url: '/ergebnisse',
    icon: ScaleIcon,
  },
  {
    title: 'Zusatzpunkte',
    url: '/zusatzpunkte',
    icon: TicketPlusIcon,
  },
];

const masterDataItems = [
  {
    title: 'Turniere',
    url: '/turniere',
    icon: FoldersIcon,
  },
  {
    title: 'Spieler',
    url: '/spieler',
    icon: UsersIcon,
  },
  {
    title: 'Teams',
    url: '/teams',
    icon: ShieldIcon,
  },
  {
    title: 'Ligen',
    url: '/ligen',
    icon: Table2Icon,
  },
  {
    title: 'Regelwerke',
    url: '/regelwerke',
    icon: PilcrowIcon,
  },
];

namespace AppSidebar {
  export interface Props extends React.ComponentProps<typeof Sidebar> {}
}

export function AppSidebar({ ...props }: AppSidebar.Props) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const championship = useOptionalChampionship();

  function closeSidebar() {
    openMobile && setOpenMobile(false);
  }

  const user = useUser();

  async function logoutUser() {
    await signOut();
  }

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarHeader className="pb-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="runde.tips">
                <a
                  href="https://www.runde.tips"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeSidebar}
                >
                  <Logo className="scale-200" />
                  <span className="pl-1 text-lg">runde.tips</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarGroup className="grow">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <NavLink to="/" onClick={closeSidebar}>
                    <HomeIcon />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {currentDataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={`/${championship?.id}${item.url}`}
                      onClick={closeSidebar}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Stammdaten</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {masterDataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={`/stammdaten${item.url}`}
                      onClick={closeSidebar}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip="User Menu">
                  <Avatar className="size-5">
                    <AvatarImage
                      src={user.photoURL || anonymousAvatarUrl}
                      alt={user.email}
                    />
                  </Avatar>
                  <div className="grid flex-1 pl-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.displayName || user.email}
                    </span>
                    {user.displayName.length > 0 && (
                      <span className="truncate text-xs">{user.email}</span>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={isMobile ? 8 : 4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-5">
                      <AvatarImage
                        src={user.photoURL || anonymousAvatarUrl}
                        alt={user.email}
                      />
                    </Avatar>
                    <div className="grid flex-1 pl-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.displayName || user.email}
                      </span>
                      {user.displayName.length > 0 && (
                        <span className="truncate text-xs">{user.email}</span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild onClick={closeSidebar}>
                    <Link to="/profil">
                      <SettingsIcon />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutUser}>
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
