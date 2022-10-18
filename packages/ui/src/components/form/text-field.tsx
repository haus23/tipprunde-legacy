import { useId } from 'react';
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { classNames } from '../../utils/class-names';

type TextFieldProps<T extends FieldValues, TPath extends Path<T>> = {
  label: string;
  control: Control<T>;
  name: TPath;
  registerOptions?: RegisterOptions<T, TPath>;
};

export function TextField<T extends FieldValues, TPath extends Path<T>>({
  label,
  control,
  name,
  registerOptions,
  ...props
}: TextFieldProps<T, TPath>) {
  const id = `${useId()}-${name}`;
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    control,
    name,
    rules: registerOptions,
  });

  return (
    <div>
      <label
        htmlFor={id}
        className={classNames(
          error ? 'text-red-500' : 'text-gray-700',
          'block text-sm font-medium'
        )}
      >
        {label}
      </label>
      <div className="relative mt-1">
        <input
          {...props}
          id={id}
          className={classNames(
            error
              ? 'border-red-300 pr-10 text-red-700 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
            'form-input block w-full rounded-md shadow-sm sm:text-sm'
          )}
          value={value}
          onChange={onChange}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error?.message && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error.message}
        </p>
      )}
    </div>
  );
}
