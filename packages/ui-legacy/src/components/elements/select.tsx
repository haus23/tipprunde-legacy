import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import type { FieldValues } from 'react-hook-form';
import { classNames } from '../../utils/class-names';

type SelectProps<T extends FieldValues> = {
  options: T[];
  selected: T;
  onChange: (option: T) => void;
};

export function Select<T extends FieldValues>({
  options,
  selected,
  onChange,
}: SelectProps<T>) {
  return (
    <Listbox value={selected} onChange={onChange} by={(a, b) => a.id === b.id}>
      {({ open }) => (
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 sm:text-sm">
            <span className="block truncate">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-hidden sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    classNames(
                      active ? 'text-white bg-indigo-600' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                    )
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                          selected ? 'font-semibold' : 'font-normal',
                          'block truncate',
                        )}
                      >
                        {option.name}
                      </span>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? 'text-white' : 'text-indigo-600',
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
