import { cn } from 'cn';
import { CircleAlertIcon } from 'lucide-react';
import { useId } from 'react';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  fieldControlStyles,
} from './field';

interface TextFieldProps extends React.ComponentProps<'input'> {
  description?: string;
  error?: string;
  label: string;
  labelClassName?: string;
}

export default function TextField({
  'aria-describedby': ariaDescribedBy,
  className,
  description,
  error,
  id: providedId,
  label,
  labelClassName,
  name,
  required,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = providedId ?? `${generatedId}-${name ?? 'field'}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId, errorId]
    .filter(Boolean)
    .join(' ');

  return (
    <Field>
      <FieldLabel htmlFor={id} required={required} className={labelClassName}>
        {label}
      </FieldLabel>
      {description && (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          required={required}
          autoComplete="off"
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          {...props}
          className={fieldControlStyles({
            className: cn('appearance-none', error && 'pr-10', className),
            invalid: Boolean(error),
          })}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <CircleAlertIcon
              className="h-5 w-5 text-destructive"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}
