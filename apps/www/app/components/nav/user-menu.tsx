import { useAuthActions } from '@convex-dev/auth/react';
import { UserIcon } from '@heroicons/react/24/outline';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Authenticated, Unauthenticated } from 'convex/react';
import { LogInIcon, LogOutIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '#/utils/auth';
import { Button } from '../(ui)/atoms/button';
import { Link } from '../(ui)/atoms/link';

export function UserMenu() {
  const [isOpen, setOpen] = useState(false);
  const { signOut } = useAuthActions();
  const user = useAuthStore((state) => state.user);
  const logOut = useAuthStore((state) => state.logOut);

  async function handleSignOut() {
    await signOut();
    logOut();
  }

  return (
    <DropdownMenu.Root modal={false} open={isOpen} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <Button variant="toolbar">
          <UserIcon className="h-6" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          collisionPadding={8}
          className="w-48 rounded-md border border-line bg-background p-2 shadow-md"
        >
          <Unauthenticated>
            <DropdownMenu.Label className="p-2 text-sm text-subtle-foreground">
              Hallo Unbekannte/r!
            </DropdownMenu.Label>
            <DropdownMenu.Item className="flex rounded-md outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="flex w-full items-center gap-x-4 rounded-md px-2 py-1 data-hovered:bg-neutral-hover"
              >
                <LogInIcon size={20} />
                <span>Log In</span>
              </Link>
            </DropdownMenu.Item>
          </Unauthenticated>
          <Authenticated>
            <DropdownMenu.Label className="p-2 text-sm text-subtle-foreground">
              Hallo {user?.name}!
            </DropdownMenu.Label>
            <DropdownMenu.Item className="flex flex-col rounded-md outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <button
                onClick={handleSignOut}
                type="button"
                className="flex cursor-default items-center gap-x-4 rounded-md px-2 py-1 hover:bg-neutral-hover"
              >
                <LogOutIcon size={20} />
                <span>Log Out</span>
              </button>
            </DropdownMenu.Item>
          </Authenticated>
          <DropdownMenu.Arrow className="fill-background stroke-2 stroke-line" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
