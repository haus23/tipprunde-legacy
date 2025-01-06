import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import * as SelectPrimitive from '@radix-ui/react-select';
import { useFocusRing, useHover } from 'react-aria';
import { tv } from 'tailwind-variants';
import { focusRingStyles } from '../styles';

const trigger = tv({
  extend: focusRingStyles,
  base: [
    'grow basis-1/2 sm:grow-0 lg:basis-1/3',
    'inline-flex items-center justify-between p-1 pl-2 translate-y-[1px]',
    'bg-primary rounded border-2 border-primary-line font-semibold data-[hovered]:bg-primary-hover transition-colors',
    'cursor-default',
  ],
});

const content = tv({
  base: [
    'max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-popper-available-width)] sm:min-w-[var(--radix-select-trigger-width)]',
    'rounded-md bg-subtle p-2 shadow-lg ring-1 ring-ring',
  ],
});

const item = tv({
  extend: focusRingStyles,
  base: [
    'my-1 cursor-pointer select-none',
    'flex items-center justify-between pl-4 pr-2 py-1 mx-1 rounded-md',
    'data-[highlighted]:bg-neutral-hover data-[state=checked]:text-accent-subtle-foreground',
  ],
});

export const Select = SelectPrimitive.Select;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;

export function SelectTrigger({
  children,
  className,
  ...props
}: SelectPrimitive.SelectTriggerProps) {
  const { isFocusVisible, focusProps } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover({});

  return (
    <SelectPrimitive.Trigger
      className={trigger({})}
      {...props}
      {...focusProps}
      {...hoverProps}
      {...{ 'data-focus-visible': isFocusVisible || undefined }}
      {...{ 'data-hovered': isHovered || undefined }}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon className="h-5 w-5" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  children,
  className,
  ...props
}: SelectPrimitive.SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        align="end"
        sideOffset={8}
        className={content({ className })}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex justify-center">
          <ChevronUpIcon className="h-5" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex justify-center">
          <ChevronDownIcon className="h-5" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  children,
  className,
  ...props
}: SelectPrimitive.SelectItemProps) {
  const { isFocusVisible, focusProps } = useFocusRing(props);

  return (
    <SelectPrimitive.Item
      className={item({ className })}
      {...props}
      {...focusProps}
      {...{ 'data-focus-visible': isFocusVisible || undefined }}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-6" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

const label = tv({
  base: 'text-sm text-subtle-foreground',
});

export function SelectLabel({
  className,
  ...props
}: SelectPrimitive.SelectLabelProps) {
  return <SelectPrimitive.Label className={label({ className })} {...props} />;
}
