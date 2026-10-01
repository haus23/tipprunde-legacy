import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Fragment } from 'react';
import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController,
} from 'react-hook-form';
import { classNames } from '../../utils/class-names';

export type SelectFieldProps<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>,
  Option extends FieldValues,
  OptionPath extends FieldPathByValue<Option, string>,
> = {
  label: string;
  control: Control<T>;
  name: TPath;
  options: Option[];
  valueField?: OptionPath;
  displayField?: OptionPath;
  descriptionField?: OptionPath;
};

export function SelectField<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>,
  Option extends FieldValues,
  OptionPath extends FieldPathByValue<Option, string>,
>({
  label,
  control,
  name,
  options,
  valueField,
  displayField,
  descriptionField,
}: SelectFieldProps<T, TPath, Option, OptionPath>) {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name,
  });

  return (
    <Listbox defaultValue={value} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label
            className={classNames('block font-medium text-gray-700 text-sm')}
          >
            {label}
          </Listbox.Label>
          <div className="relative mt-1">
            <div className="inline-flex w-full rounded-md border border-gray-300 shadow-xs">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pr-10 pl-3 text-left shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                <span className="block truncate">{value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronsUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
            </div>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-full origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-hidden">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pr-4 pl-8',
                      )
                    }
                    value={option[valueField || 'id']}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate',
                          )}
                        >
                          {option[displayField || 'name']}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute top-3 left-0 flex items-center pl-1.5',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                        {descriptionField && option[descriptionField] && (
                          <p
                            className={classNames(
                              active
                                ? 'bg-indigo-600 text-gray-300'
                                : 'text-gray-500',
                              'mt-1',
                            )}
                          >
                            {option[descriptionField]}
                          </p>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
