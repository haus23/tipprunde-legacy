import { type LinkProps, Link as _Link } from '@tanstack/react-router';

import { tv } from 'tailwind-variants';
import { focusStyles } from './_styles';
import { useActionContext } from './action-context';

const linkStyles = tv({
  extend: focusStyles,
});

namespace Link {
  export interface Props extends LinkProps {
    className?: string;
  }
}

export function Link({ className, ...props }: Link.Props) {
  const ctx = useActionContext();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    ctx?.onAction();
  }

  return (
    <_Link
      onClick={handleClick}
      className={linkStyles({ className })}
      {...props}
    />
  );
}
