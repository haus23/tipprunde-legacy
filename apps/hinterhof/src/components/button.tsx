import { cn } from 'cn';
import { focusRing } from '#/styles/focus';

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'icon';
}

export default function Button({
  children,
  className,
  type = 'button',
  variant = 'secondary',
  size = 'default',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        focusRing,
        'inline-flex h-9 items-center justify-center rounded-md border font-medium text-sm shadow-xs transition-colors disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none',
        variant === 'primary'
          ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80'
          : 'border-input bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground active:bg-muted',
        size === 'icon' ? 'w-9 px-0' : 'px-4',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
