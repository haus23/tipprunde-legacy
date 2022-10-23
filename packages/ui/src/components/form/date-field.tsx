import { useId } from 'react';
import {
  Control,
  FieldPathByValue,
  FieldValues,
  useController,
} from 'react-hook-form';

type DateFieldProps<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>
> = {
  label: string;
  control: Control<T>;
  name: TPath;
};

export function DateField<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>
>({ label, control, name }: DateFieldProps<T, TPath>) {
  const id = `${useId()}-${name}`;

  const {
    field: { value, ...props },
  } = useController({
    control,
    name,
  });

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type="date"
          className="form-input block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          value={value ?? ''}
          {...props}
        />
      </div>
    </div>
  );
}
