import { UserIcon } from '@heroicons/react/24/outline';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogInIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../(ui)/atoms/button';
import { Link } from '../(ui)/atoms/link';

export function UserMenu() {
  const [isOpen, setOpen] = useState(false);

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
          <DropdownMenu.Label className="p-2 text-sm text-subtle-foreground">
            Hallo Unbekannte/r!
          </DropdownMenu.Label>
          <DropdownMenu.Item className="flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <Link
              onClick={() => setOpen(false)}
              to="/login"
              className="flex w-full items-center gap-x-4 rounded-md px-2 py-1 data-[hovered]:bg-neutral-hover"
            >
              <LogInIcon size={20} />
              <span>Log In</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="fill-background stroke-2 stroke-line" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
