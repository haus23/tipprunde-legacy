import { Switch } from '@headlessui/react';
import { classNames } from '../../utils/class-names';

type ToggleFieldProps = {
  label?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export default function ToggleField({
  label,
  checked,
  onChange,
}: ToggleFieldProps) {
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={checked}
        onChange={onChange}
        className={classNames(
          checked ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            checked ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      {label && (
        <Switch.Label as="span" className="ml-3">
          <span className="text-sm font-medium text-gray-900">{label}</span>
        </Switch.Label>
      )}
    </Switch.Group>
  );
}
