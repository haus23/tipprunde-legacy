import { Popover as BasePopover } from '@base-ui/react/popover';
import { InfoIcon } from 'lucide-react';
import { cn } from '#/utils/cn';
import { focusVisibleStyles, iconTriggerStyles } from './_styles';

// Small info popover behind an icon button. Click, tap and keyboard open it;
// Escape, a click outside or the trigger close it again.

namespace Popover {
  export interface Props {
    children: React.ReactNode;
    offset?: number;
    triggerClassName?: string;
    triggerIcon?: React.ElementType;
    triggerLabel: string;
  }
}

export function Popover({
  children,
  offset = 2,
  triggerClassName,
  triggerIcon,
  triggerLabel,
}: Popover.Props) {
  const TriggerIcon = triggerIcon ?? InfoIcon;

  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        aria-label={triggerLabel}
        className={cn(focusVisibleStyles, iconTriggerStyles, triggerClassName)}
      >
        <TriggerIcon className="size-5" aria-hidden="true" />
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner side="top" sideOffset={offset}>
          <BasePopover.Popup className="rounded-md border bg-popover text-foreground shadow-md outline-hidden transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none">
            <BasePopover.Arrow className="data-[side=bottom]:-top-2 data-[side=left]:-right-3 data-[side=top]:-bottom-2 data-[side=right]:-left-3 data-[side=bottom]:rotate-180 data-[side=left]:-rotate-90 data-[side=right]:rotate-90">
              <svg width={12} height={8} viewBox="0 0 12 8" aria-hidden="true">
                <path
                  d="M0 0 L6 6 L12 0"
                  className="fill-popover stroke-border"
                />
              </svg>
            </BasePopover.Arrow>
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
