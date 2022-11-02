import { classNames } from '@/utils/class-names';
import { MergeElementProps } from '@/utils/merge-element-props';

type ButtonProps = MergeElementProps<
  'button',
  {
    primary?: boolean;
  }
>;

export default function Button({ children, primary, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames(
        primary
          ? 'text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-300 dark:focus:ring-blue-800'
          : 'text-gray-900 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-100 border border-gray-200 dark:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-700 hover:text-blue-700 dark:hover:text-white dark:hover:bg-gray-700',
        ' px-5 py-2.5 font-medium rounded-lg focus:outline-none focus:ring-4'
      )}
    >
      {children}
    </button>
  );
}
