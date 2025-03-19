import { SearchIcon } from 'lucide-react';
import { Button } from '#/components/ui/button';

export function ChampionshipSelect() {
  return (
    <Button variant="ghost" className="flex gap-x-1">
      <SearchIcon className="size-5" />
      <span>Turnier</span>
    </Button>
  );
}
