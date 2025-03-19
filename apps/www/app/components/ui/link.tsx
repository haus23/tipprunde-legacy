import { type LinkProps, Link as _Link } from 'react-aria-components';

import { tv } from 'tailwind-variants';
import { focusStyles } from './_styles';

const linkStyles = tv({
  extend: focusStyles,
});

namespace Link {
  export interface Props extends LinkProps {
    className?: string;
  }
}

export function Link({ className, ...props }: Link.Props) {
  return <_Link className={linkStyles({ className })} {...props} />;
}
