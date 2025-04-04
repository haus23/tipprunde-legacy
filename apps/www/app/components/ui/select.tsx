import type { SelectProps } from 'react-aria-components';
import {
  Button,
  Label,
  ListBox,
  Popover,
  SelectValue,
  Select as _Select,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

const popoverStyles = tv({
  base: ['min-w-[var(--trigger-width)]'],
});

namespace Select {
  export interface Props<T extends object>
    extends Omit<SelectProps, 'children'> {
    label: string;
    items?: Iterable<T>;
    children: React.ReactNode | ((item: T) => React.ReactNode);
  }
}

export function Select<T extends object>({
  children,
  items,
  label,
  selectedKey,
  ...props
}: Select.Props<T>) {
  return (
    <_Select {...props}>
      <div>
        <Label>{label}</Label>
        <Button className={'w-96'}>
          <SelectValue />
          <span aria-hidden="true">▼</span>
        </Button>
      </div>
      <Popover className={popoverStyles()}>
        <ListBox items={items}>{children}</ListBox>
      </Popover>
    </_Select>
  );
}
