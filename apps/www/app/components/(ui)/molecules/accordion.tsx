import { ChevronDownIcon } from '@heroicons/react/24/outline';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { useFocusRing, useHover } from 'react-aria';
import { tv } from 'tailwind-variants';

import { focusRingStyles } from '../styles';

export const Accordion = AccordionPrimitive.Root;

const trigger = tv({
  extend: focusRingStyles,
  base: [
    'group cursor-default',
    'px-2 p-1 rounded-sm grow flex items-center justify-between font-medium transition-all',
    'data-[focus-visible]:ring-offset-primary',
  ],
});

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.AccordionTriggerProps) {
  const { focusProps, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover({});

  return (
    <AccordionPrimitive.Header
      className="flex p-1 bg-primary rounded data-[hovered]:bg-primary-hover"
      {...hoverProps}
      {...{ 'data-hovered': isHovered || undefined }}
    >
      <AccordionPrimitive.Trigger
        className={trigger({ className })}
        {...props}
        {...focusProps}
        {...{ 'data-focus-visible': isFocusVisible || undefined }}
      >
        {children}
        <ChevronDownIcon className="h-5 transition-transform duration-150 group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

const item = tv({
  base: 'pt-1',
});

export function AccordionItem({
  className,
  ...props
}: AccordionPrimitive.AccordionItemProps) {
  return <AccordionPrimitive.Item className={item({ className })} {...props} />;
}

const content = tv({
  base: 'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden',
});

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.AccordionContentProps) {
  return (
    <AccordionPrimitive.Content className={content({ className })} {...props}>
      {children}
    </AccordionPrimitive.Content>
  );
}
