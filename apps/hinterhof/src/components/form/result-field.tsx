import { Tooltip } from '@base-ui/react/tooltip';
import { cn } from '#/utils/cn';
import { useId } from 'react';
import { fieldControlStyles } from './field';

// Compact input for match results and tips in table rows: the label is for
// screen readers only, and an error shows as an asterisk next to the field
// with the message in a tooltip instead of below the field.
// The gap leaves room for the focus ring between input and marker.

interface ResultFieldProps
  extends Omit<React.ComponentProps<'input'>, 'className' | 'type'> {
  className?: string;
  error?: string;
  label: string;
}

export default function ResultField({
  'aria-describedby': ariaDescribedBy,
  className,
  error,
  id: providedId,
  label,
  name,
  ...props
}: ResultFieldProps) {
  const generatedId = useId();
  const id = providedId ?? `${generatedId}-${name ?? 'result'}`;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ');

  return (
    <Tooltip.Root disabled={!error}>
      <Tooltip.Trigger
        render={<div />}
        closeOnClick={false}
        className={cn('flex items-center gap-x-2.5', className)}
      >
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          name={name}
          autoComplete="off"
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          {...props}
          type="text"
          className={fieldControlStyles({
            className: 'w-16 px-2 text-center font-medium tabular-nums',
            invalid: Boolean(error),
          })}
        />
        <span
          className="w-2 shrink-0 font-semibold text-destructive"
          aria-hidden="true"
        >
          {error && '*'}
        </span>
        {error && (
          <span id={errorId} className="sr-only">
            {error}
          </span>
        )}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner className="z-50" side="top" sideOffset={6}>
          <Tooltip.Popup className="rounded-md border border-destructive/40 bg-popover px-2 py-1 text-destructive text-sm shadow-md">
            {error}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
