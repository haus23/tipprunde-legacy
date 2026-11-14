import { cn } from '#/utils/cn';

export function Field({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('space-y-1.5', className)} {...props} />;
}

type FieldLabelProps = Omit<React.ComponentProps<'label'>, 'htmlFor'> & {
  htmlFor: string;
  required?: boolean;
};

export function FieldLabel({
  children,
  className,
  htmlFor,
  required,
  ...props
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-foreground', className)}
      {...props}
    >
      {children}
      {required && (
        <span className="text-destructive" aria-hidden="true">
          {' '}
          *
        </span>
      )}
    </label>
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

export function FieldError({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-destructive', className)} {...props} />;
}

export function fieldControlStyles({
  className,
  invalid = false,
}: {
  className?: string;
  invalid?: boolean;
} = {}) {
  return cn(
    'block w-full rounded-md border bg-background px-3 py-2 text-foreground shadow-xs transition-colors placeholder:text-muted-foreground read-only:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground motion-reduce:transition-none sm:text-sm',
    invalid
      ? 'border-destructive text-destructive focus-visible:outline-destructive'
      : 'border-input focus-visible:border-ring focus-visible:outline-ring',
    className,
  );
}
