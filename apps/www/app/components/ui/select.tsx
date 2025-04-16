import { ChevronDownIcon } from 'lucide-react';
import type { SelectProps } from 'react-aria-components';
import {
  Button,
  ListBox,
  Popover,
  SelectValue,
  Select as _Select,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { focusVisibleStyles } from './_styles';

const triggerStyles = tv({
  base: [
    focusVisibleStyles,
    'border border-accent-7 bg-accent-9 text-[var(--blue-1)] transition-colors hover:bg-accent-10 active:brightness-110',
    'inline-flex grow items-center justify-between md:grow-0 md:basis-3/4 lg:basis-2/3',
    'py-1 pr-2 pl-4',
  ],
});

const popoverStyles = tv({
  base: [
    'min-w-[var(--trigger-width)]',
    'z-10 overflow-y-auto rounded-sm bg-background px-2 ring-1 ring-gray-6',
  ],
});

namespace Select {
  export interface Props<T extends object>
    extends Omit<SelectProps, 'children'> {
    items?: Iterable<T>;
    children: React.ReactNode | ((item: T) => React.ReactNode);
  }
}

export function Select<T extends object>({
  children,
  items,
  selectedKey,
  ...props
}: Select.Props<T>) {
  return (
    <_Select {...props} className={'flex grow'}>
      <Button className={triggerStyles()}>
        <SelectValue className="group select-value" />
        <ChevronDownIcon className="size-5" />
      </Button>
      <Popover className={popoverStyles()}>
        <ListBox items={items}>{children}</ListBox>
      </Popover>
    </_Select>
  );
}
