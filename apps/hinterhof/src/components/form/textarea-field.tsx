import { classNames } from '@/utils/class-names';
import type { MergeElementProps } from '@/utils/merge-element-props';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { type ForwardedRef, forwardRef, useId } from 'react';

type TextareaFieldProps = MergeElementProps<
  'textarea',
  {
    label: string;
    error?: string;
  }
>;

type Ref = HTMLTextAreaElement;

function TextareaField(
  { label, error, name, required, ...props }: TextareaFieldProps,
  ref: ForwardedRef<Ref>,
) {
  const hasError = typeof error !== 'undefined';
  const id = `${useId()}-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className={classNames(
          'block text-sm font-medium',
          hasError ? 'text-red-500' : 'text-gray-700',
        )}
      >
        {label} {required && '*'}
      </label>
      <div className="relative mt-1">
        <textarea
          id={id}
          name={name}
          required={required}
          ref={ref}
          autoComplete="off"
          {...props}
          className={classNames(
            'block w-full rounded-md placeholder-gray-400 shadow-sm sm:text-sm',
            hasError
              ? 'text-red-500 border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
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

export default forwardRef<Ref, TextareaFieldProps>(TextareaField);
