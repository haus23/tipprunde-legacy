import { Fragment } from 'react';
import {
  Control,
  FieldPathByValue,
  FieldValues,
  Path,
  useController,
} from 'react-hook-form';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { classNames } from '../../utils/class-names';

export type SelectFieldProps<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, Date>,
  TOption extends Record<string, unknown>
> = {
  label: string;
  control: Control<T>;
  name: TPath;
  options: TOption[];
  valueField: Path<TOption>;
  displayField: Path<TOption>;
  descriptionField?: Path<TOption>;
};

export function SelectField<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, Date>,
  TOption extends Record<string, any>
>({
  label,
  control,
  name,
  options,
  valueField,
  displayField,
  descriptionField,
}: SelectFieldProps<T, TPath, TOption>) {
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
            <div className="inline-flex w-full rounded-md border border-gray-300 shadow-sm">
              <Listbox.Button
                as="div"
                className="inline-flex divide-x w-full divide-gray-200 rounded-md shadow-sm"
              >
                <div className="inline-flex items-center w-full rounded-l-md border border-transparent py-2 pl-3 pr-4 shadow-sm">
                  <p className="text-sm">{value}</p>
                </div>
                <button className="inline-flex items-center rounded-l-none rounded-r-md p-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                  <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </Listbox.Button>
            </div>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-full origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {options.map((option, ix) => (
                  <Listbox.Option
                    key={ix}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-8 pr-4'
                      )
                    }
                    value={option[valueField]}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          )}
                        >
                          {option[displayField]}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute left-0 top-3 flex items-center pl-1.5'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                        {descriptionField && (
                          <p
                            className={classNames(
                              active
                                ? 'text-gray-300 bg-indigo-600'
                                : 'text-gray-500',
                              'mt-1'
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
