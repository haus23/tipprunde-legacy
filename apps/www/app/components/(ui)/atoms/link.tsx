import { useFocusRing, useHover } from 'react-aria';
import {
  type LinkProps,
  type NavLinkProps,
  Link as RRLink,
  NavLink as RRNavLink,
} from 'react-router';
import { tv } from 'tailwind-variants';

import { focusRingStyles } from '../styles';

const styles = tv({
  extend: focusRingStyles,
  base: 'transition-all',
});

namespace Link {
  export interface Props extends LinkProps {}
}

export function Link({ className, ...props }: Link.Props) {
  const { focusProps, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover({});

  return (
    <RRLink
      viewTransition
      className={styles({ className })}
      {...props}
      {...focusProps}
      {...hoverProps}
      {...{ 'data-focus-visible': isFocusVisible || undefined }}
      {...{ 'data-hovered': isHovered || undefined }}
    />
  );
}

namespace NavLink {
  export interface Props extends NavLinkProps {
    className?: string;
  }
}

export function NavLink({ className, ...props }: NavLink.Props) {
  const { focusProps, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover({});

  return (
    <RRNavLink
      viewTransition
      className={styles({ className })}
      {...props}
      {...focusProps}
      {...hoverProps}
      {...{ 'data-focus-visible': isFocusVisible || undefined }}
      {...{ 'data-hovered': isHovered || undefined }}
    />
  );
}
