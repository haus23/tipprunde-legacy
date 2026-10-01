import { CircleAlertIcon } from 'lucide-react';
import { type ForwardedRef, forwardRef, useId } from 'react';
import { classNames } from '#/utils/class-names';
import type { MergeElementProps } from '#/utils/merge-element-props';

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
          'block font-medium text-sm',
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
            'block w-full rounded-md placeholder-gray-400 shadow-xs sm:text-sm',
            hasError
              ? 'border-red-300 text-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
          )}
        />
        {hasError && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <CircleAlertIcon
              data-testid="errorIcon"
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 font-normal text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}

export default forwardRef<Ref, TextareaFieldProps>(TextareaField);
