import { Popover } from '@base-ui/react/popover';
import { InfoIcon } from 'lucide-react';
import { cn } from '#/utils/cn';
import { focusVisibleStyles, iconTriggerStyles } from './_styles';

// A short hint behind an info icon, styled like a tooltip. Unlike a tooltip
// it is a popover: hover, click, tap and keyboard open it, so it is also
// reachable on touch devices and by screen readers.

namespace Infotip {
  export interface Props {
    children: React.ReactNode;
    className?: string;
    label: string;
  }
}

export function Infotip({ children, className, label }: Infotip.Props) {
  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover
        aria-label={label}
        className={cn(focusVisibleStyles, iconTriggerStyles, className)}
      >
        <InfoIcon className="size-5" aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="top">
          <Popover.Popup className="origin-(--transform-origin) rounded-sm bg-foreground px-2 py-1 text-background text-sm outline-hidden transition-[opacity,scale] duration-125 data-ending-style:scale-[0.97] data-starting-style:scale-[0.97] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-100 motion-reduce:transition-none">
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
