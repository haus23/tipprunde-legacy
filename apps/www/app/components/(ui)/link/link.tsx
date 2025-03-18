import {
  type LinkProps,
  type NavLinkProps,
  Link as _Link,
  NavLink as _NavLink,
} from 'react-router';
import { tv } from 'tailwind-variants';

import { focusStyles } from '../focus-styles';

const linkStyles = tv({
  extend: focusStyles,
});

namespace Link {
  export interface Props extends LinkProps {}
}

export function Link({ className, ...props }: Link.Props) {
  return <_Link className={linkStyles({ className })} {...props} />;
}

namespace NavLink {
  export interface Props extends NavLinkProps {
    className?: string;
  }
}

export function NavLink({ className, ...props }: NavLink.Props) {
  return <_NavLink className={linkStyles({ className })} {...props} />;
}
