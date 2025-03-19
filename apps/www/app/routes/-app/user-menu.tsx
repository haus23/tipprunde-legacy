import { UserIcon } from 'lucide-react';
import { Button } from '#/components/ui/button';

export function UserMenu() {
  return (
    <Button variant="ghost">
      <UserIcon className="size-5" />
    </Button>
  );
}
