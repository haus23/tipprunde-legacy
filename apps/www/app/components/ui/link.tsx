import { type LinkProps, Link as _Link } from '@tanstack/react-router';
import { useFocusRing, useHover } from 'react-aria';
import { type VariantProps, tv } from 'tailwind-variants';

import { componentHoverStyles, focusVisibleStyles } from './_styles';
import { useActionContext } from './action-context';

const linkStyles = tv({
  base: [focusVisibleStyles, 'p-2'],
  variants: {
    variant: {
      default: '',
      navlink: componentHoverStyles,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

namespace Link {
  export interface Props extends LinkProps, VariantProps<typeof linkStyles> {
    className?: string;
  }
}

export function Link({ className, variant, ...props }: Link.Props) {
  const ctx = useActionContext();
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({});

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    ctx?.onAction();
  }

  return (
    <_Link
      onClick={handleClick}
      className={linkStyles({ variant, className })}
      {...(isFocusVisible && { 'data-focus-visible': true })}
      {...focusProps}
      {...(isHovered && { 'data-hovered': true })}
      {...hoverProps}
      {...props}
    />
  );
}
