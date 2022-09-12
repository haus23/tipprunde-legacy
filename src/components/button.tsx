import { classNames } from '@/utils/class-names';
import { MergeElementProps } from '@/utils/merge-element-props';
import { ForwardedRef, forwardRef, ReactNode } from 'react';

type ButtonProps = MergeElementProps<'button'> & {
  type?: 'button' | 'submit';
  primary?: boolean;
};

type Ref = HTMLButtonElement;

function Button(
  {
    children,
    className,
    type = 'button',
    primary = false,
    ...props
  }: ButtonProps,
  ref: ForwardedRef<Ref>
) {
  return (
    <button
      type={type}
      ref={ref}
      className={classNames(
        'inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        primary
          ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default forwardRef<Ref, ButtonProps>(Button);
