import { InformationCircleIcon } from '@heroicons/react/24/outline';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { type ElementType, useRef, useState } from 'react';
import { useHover } from 'react-aria';
import { tv } from 'tailwind-variants';

const styles = tv({
  base: 'rounded-md bg-subtle text-accent-foreground shadow-md outline-none ring-1 ring-ring animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
});

namespace InfoBox {
  export interface Props extends PopoverPrimitive.PopoverContentProps {
    icon?: ElementType;
    ariaTriggerLabel?: string;
  }
}

export function InfoBox({
  className,
  children,
  icon,
  sideOffset = 2,
  ariaTriggerLabel,
  ...props
}: InfoBox.Props) {
  const [isOpen, setOpen] = useState(false);
  const debounceRef = useRef(false);

  const { hoverProps } = useHover({
    onHoverChange(isHovering) {
      if (isHovering) {
        debounceRef.current = true;
        setOpen(true);
        setTimeout(() => {
          debounceRef.current = false;
        }, 50);
      } else {
        if (!debounceRef.current) setOpen(false);
      }
    },
  });

  const TriggerIcon = icon ?? InformationCircleIcon;

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        aria-label={ariaTriggerLabel}
        {...hoverProps}
        className="rounded focus:outline-none focus-visible:outline focus-visible:outline-ring"
      >
        <TriggerIcon className="h-5" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        className={styles({ className })}
        {...props}
        {...hoverProps}
      >
        <PopoverPrimitive.Arrow className="h-2 w-4 fill-ring" />
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
}
