import { InfoIcon } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import type { PopoverProps } from 'react-aria-components';
import { OverlayArrow, Popover as _Popover } from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { Button } from './button';

const popoverStyles = tv({
  base: [
    'group rounded-md border bg-background shadow-md dark:bg-gray-2',
    'data-[placement=top]:translate-y-1',
    'data-[placement=bottom]:-translate-y-2 data-[placement=bottom]:mt-0.5',
    'data-[placement=left]:mr-1.5 data-[placement=left]:translate-x-2',
    'data-[placement=right]:-translate-x-2 data-[placement=right]:ml-1.5',
  ],
});
const overlayArrowStyles = tv({
  base: [
    'block fill-background stroke-1 stroke-gray-6',
    'group-data-[placement=bottom]:rotate-180',
    'group-data-[placement=left]:-rotate-90',
    'group-data-[placement=right]:rotate-90',
  ],
});

namespace Popover {
  export interface Props extends PopoverProps {
    triggerIcon?: React.ElementType;
    triggerLabel?: string;
    children: React.ReactNode;
  }
}

export function Popover({
  children,
  triggerIcon,
  triggerLabel,
  ...props
}: Popover.Props) {
  const TriggerIcon = triggerIcon ?? InfoIcon;

  const [isOpen, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (isOpen) {
      function handleOutsideClick(ev: PointerEvent) {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(ev.target as Node) &&
          popoverRef.current &&
          !popoverRef.current.contains(ev.target as Node)
        ) {
          setOpen(false);
        }
      }
      window.addEventListener('pointerdown', handleOutsideClick, {
        capture: true,
      });

      return () => {
        window.removeEventListener('pointerdown', handleOutsideClick, {
          capture: true,
        });
      };
    }
  }, [isOpen]);

  return (
    <>
      <Button
        ref={triggerRef}
        onPress={() => setOpen(!isOpen)}
        variant="plain"
        className="p-1.5 text-gray-11"
        aria-label={triggerLabel}
      >
        <TriggerIcon className="size-5" />
      </Button>
      <_Popover
        ref={popoverRef}
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setOpen}
        isNonModal
        offset={6}
        placement="top"
        className={popoverStyles()}
        {...props}
      >
        <OverlayArrow>
          <svg
            role="img"
            aria-label="Arrow pointing to trigger"
            width={12}
            height={12}
            viewBox="0 0 12 12"
            className={overlayArrowStyles()}
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </OverlayArrow>
        {children}
      </_Popover>
    </>
  );
}
