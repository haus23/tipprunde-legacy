import { cn } from '#/utils/cn';
import { componentHoverStyles, focusVisibleStyles } from './_styles';
import { useActionContext } from './action-context';

const variants = {
  plain: '',
  primary:
    'border bg-accent-9 px-4 text-white transition-transform hover:bg-accent-10 active:scale-[0.98]',
  secondary: '',
  ghost: componentHoverStyles,
};

namespace Button {
  export interface Props extends React.ComponentProps<'button'> {
    variant?: keyof typeof variants;
  }
}

export function Button({
  className,
  variant = 'primary',
  onClick,
  type = 'button',
  ...props
}: Button.Props) {
  const ctx = useActionContext();

  return (
    <button
      type={type}
      onClick={(event) => {
        onClick?.(event);
        ctx?.onAction();
      }}
      className={cn(
        focusVisibleStyles,
        'inline-flex items-center justify-center p-2 font-semibold text-sm transition-colors',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
