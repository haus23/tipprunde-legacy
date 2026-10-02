import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController,
} from 'react-hook-form';
import Select from './select';
import type { SelectionOption } from './selection';

type SelectFieldProps<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>,
  Option extends SelectionOption,
> = {
  control: Control<T>;
  label: string;
  name: TPath;
  options: readonly Option[];
};

export default function SelectField<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>,
  Option extends SelectionOption,
>({ control, label, name, options }: SelectFieldProps<T, TPath, Option>) {
  const { field } = useController({ control, name });

  return (
    <Select
      label={label}
      name={field.name}
      options={options}
      value={field.value}
      onBlur={field.onBlur}
      onValueChange={field.onChange}
      ref={field.ref}
    />
  );
}
