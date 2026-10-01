import { cn } from 'cn';
import { useId } from 'react';

type ToggleFieldProps = Omit<
  React.ComponentProps<'input'>,
  'checked' | 'className' | 'defaultChecked' | 'type'
> & {
  checked: boolean;
  className?: string;
  label: string;
};

export default function ToggleField({
  checked,
  className,
  id: providedId,
  label,
  ...props
}: ToggleFieldProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex items-center gap-x-3 font-medium text-foreground text-sm has-disabled:cursor-not-allowed has-disabled:opacity-50',
        className,
      )}
    >
      <input
        {...props}
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        aria-checked={checked}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent bg-muted shadow-inner transition-colors after:absolute after:top-0 after:left-0 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-xs after:transition-transform peer-checked:bg-primary peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-ring peer-focus-visible:outline-offset-2 motion-reduce:transition-none motion-reduce:after:transition-none"
      />
      <span>{label}</span>
    </label>
  );
}
