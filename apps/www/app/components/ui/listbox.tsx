import type { ListBoxItemProps, ListBoxProps } from 'react-aria-components';
import {
  ListBox as _ListBox,
  ListBoxItem as _ListBoxItem,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { componentHoverStyles, focusVisibleStyles } from './_styles';

const listStyles = tv({ base: 'px-2' });
const itemStyles = tv({
  base: [
    focusVisibleStyles,
    'data-focus-visible:text-gray-12',
    componentHoverStyles,
    'my-1.5 select-none px-4 py-1.5',
  ],
});

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
