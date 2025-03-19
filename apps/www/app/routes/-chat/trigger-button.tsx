import { MessageCircleIcon } from 'lucide-react';
import { Button } from '#/components/ui/button';

export function TriggerButton() {
  return (
    <Button variant="ghost" className="relative">
      <MessageCircleIcon className="size-5" />
      <div className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-accent-9">
        <output className="text-white text-xs">1</output>
      </div>
    </Button>
  );
}
