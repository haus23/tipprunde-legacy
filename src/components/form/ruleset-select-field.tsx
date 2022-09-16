import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

import { DisplayModel } from '@/model/display-model';
import { classNames } from '@/utils/class-names';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type SelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  error?: string;
  options: DisplayModel[];
};

export default function SelectField({
  value,
  label,
  error,
  options,
  required,
  onChange,
}: SelectFieldProps) {
  const hasError = typeof error !== 'undefined';

  return (
    <div>
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <>
            <Listbox.Label
              className={classNames(
                'block text-sm font-medium',
                hasError ? 'text-red-500' : 'text-gray-700'
              )}
            >
              {label} {required && '*'}
            </Listbox.Label>
            <div className="relative mt-1">
              <div className="inline-flex w-full rounded-md border border-gray-300 shadow-sm">
                <div className="inline-flex divide-x w-full divide-gray-200 rounded-md shadow-sm">
                  <div className="inline-flex items-center w-full rounded-l-md border border-transparent py-2 pl-3 pr-4 shadow-sm">
                    <p className="text-sm">
                      {value.split(/(?=[A-Z])/).join(' ')}
                    </p>
                  </div>
                  <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md p-2 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                    <span className="sr-only">Change published status</span>
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  </Listbox.Button>
                </div>
              </div>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute right-0 z-10 mt-2 w-full origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.name}
                      className={({ active }) =>
                        classNames(
                          active && 'bg-gray-50',
                          'cursor-default select-none p-4 text-sm'
                        )
                      }
                      value={option.name}
                    >
                      {({ selected, active }) => (
                        <div className="flex flex-col">
                          <div className="flex justify-between">
                            <p
                              className={
                                selected ? 'font-semibold' : 'font-normal'
                              }
                            >
                              {option.name.split(/(?=[A-Z])/).join(' ')}
                            </p>
                            {selected ? (
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : null}
                          </div>
                          <p className="mt-2">{option.description}</p>
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}
