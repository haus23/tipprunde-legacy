import { Link as _Link, type LinkProps } from '@tanstack/react-router';
import { cn } from '#/utils/cn';
import { componentHoverStyles, focusVisibleStyles } from './_styles';
import { useActionContext } from './action-context';

const variants = {
  plain: '',
  default: 'underline-offset-2 hover:underline',
  navlink: componentHoverStyles,
};

namespace Link {
  export interface Props extends LinkProps {
    className?: string;
    variant?: keyof typeof variants;
  }
}

export function Link({ className, variant = 'default', ...props }: Link.Props) {
  const ctx = useActionContext();

  return (
    <_Link
      onClick={() => ctx?.onAction()}
      className={cn(focusVisibleStyles, 'p-2', variants[variant], className)}
      {...props}
    />
  );
}
