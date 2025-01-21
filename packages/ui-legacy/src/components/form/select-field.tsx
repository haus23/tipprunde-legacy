import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
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
            className={classNames('block text-sm font-medium text-gray-700')}
          >
            {label}
          </Listbox.Label>
          <div className="relative mt-1">
            <div className="inline-flex w-full rounded-md border border-gray-300 shadow-xs">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                <span className="block truncate">{value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
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
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-8 pr-4',
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
                              'absolute left-0 top-3 flex items-center pl-1.5',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                        {descriptionField && option[descriptionField] && (
                          <p
                            className={classNames(
                              active
                                ? 'text-gray-300 bg-indigo-600'
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
