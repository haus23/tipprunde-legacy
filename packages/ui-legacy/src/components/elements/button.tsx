import { classNames } from '../../utils/class-names';
import type { MergeElementProps } from '../../utils/merge-element-props';

type ButtonProps = MergeElementProps<
  'button',
  {
    primary?: boolean;
  }
>;

export function Button({ children, primary, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames(
        primary
          ? 'border-transparent bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 disabled:bg-indigo-400'
          : 'border-gray-300 bg-white text-gray-700 shadow-xs hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-500',
        'inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
      )}
    >
      {children}
    </button>
  );
}
