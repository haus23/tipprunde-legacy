import { useId } from 'react';
import { Field, FieldError, FieldLabel, fieldControlStyles } from './field';

interface DateFieldProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  error?: string;
  label: string;
}

export default function DateField({
  'aria-describedby': ariaDescribedBy,
  className,
  error,
  id: providedId,
  label,
  name,
  ...props
}: DateFieldProps) {
  const generatedId = useId();
  const id = providedId ?? `${generatedId}-${name ?? 'date'}`;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ');

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        name={name}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        {...props}
        type="date"
        className={fieldControlStyles({ className, invalid: Boolean(error) })}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
