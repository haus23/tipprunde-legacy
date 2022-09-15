import { ForwardedRef, forwardRef, useId } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/class-names';
import { MergeElementProps } from '@/utils/merge-element-props';

type TextFieldProps = MergeElementProps<
  'input',
  {
    label: string;
    error?: string;
  }
>;

type Ref = HTMLInputElement;

function TextField(
  { label, error, name, required, ...props }: TextFieldProps,
  ref: ForwardedRef<Ref>
) {
  const hasError = typeof error !== 'undefined';
  const id = `${useId()}-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className={classNames(
          'block text-sm font-medium',
          hasError ? 'text-red-500' : 'text-gray-700'
        )}
      >
        {label} {required && '*'}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          name={name}
          required={required}
          ref={ref}
          autoComplete="off"
          {...props}
          className={classNames(
            'block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm',
            hasError
              ? 'text-red-500 border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          )}
        />
        {hasError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              data-testid="errorIcon"
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm font-normal text-red-400">{error}</p>
      )}
    </div>
  );
}

export default forwardRef<Ref, TextFieldProps>(TextField);
