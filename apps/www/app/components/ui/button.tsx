import { cn } from '#/utils/cn';
import { componentHoverStyles, focusVisibleStyles } from './_styles';
import { useActionContext } from './action-context';

const variants = {
  plain: '',
  ghost: componentHoverStyles,
};

namespace Button {
  export interface Props extends React.ComponentProps<'button'> {
    variant?: keyof typeof variants;
  }
}

export function Button({
  className,
  variant = 'plain',
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
        'inline-flex items-center justify-center p-2 font-semibold text-sm transition-[color,background-color,scale] motion-safe:active:scale-[0.97]',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
