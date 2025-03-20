import type { ListBoxItemProps, ListBoxProps } from 'react-aria-components';
import {
  ListBox as _ListBox,
  ListBoxItem as _ListBoxItem,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

const listStyles = tv({});
const itemStyles = tv({});

namespace ListBox {
  export interface Props<T> extends ListBoxProps<T> {
    className?: string;
  }
}

export function ListBox<T extends object>({
  className,
  ...props
}: ListBox.Props<T>) {
  return <_ListBox className={listStyles({ className })} {...props} />;
}

namespace ListBoxItem {
  export interface Props<T> extends ListBoxItemProps<T> {
    className?: string;
  }
}

export function ListBoxItem<T extends object>({
  className,
  ...props
}: ListBoxItem.Props<T>) {
  return <_ListBoxItem className={itemStyles({ className })} {...props} />;
}
