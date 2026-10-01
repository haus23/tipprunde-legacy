import { useId } from 'react';
import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController,
} from 'react-hook-form';
import { Field, FieldError, FieldLabel, fieldControlStyles } from './field';

type DateFieldProps<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>,
> = {
  control: Control<T>;
  label: string;
  name: TPath;
};

export default function DateField<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>,
>({ control, label, name }: DateFieldProps<T, TPath>) {
  const id = `${useId()}-${name}`;
  const {
    field: { value, ...field },
    fieldState: { error },
  } = useController({ control, name });
  const errorId = error?.message ? `${id}-error` : undefined;

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        {...field}
        id={id}
        type="date"
        value={value ?? ''}
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        className={fieldControlStyles({ invalid: Boolean(error) })}
      />
      {error?.message && <FieldError id={errorId}>{error.message}</FieldError>}
    </Field>
  );
}
