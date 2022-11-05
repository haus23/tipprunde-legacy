import { classNames } from '@/utils/class-names';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { BaseModel } from 'lib';
import { Fragment } from 'react';

type ModelPath<T extends BaseModel> = keyof {
  [K in keyof T as string extends T[K] ? K : never]: T[K];
};

type SelectProps<T extends BaseModel, TPath = ModelPath<T>> = {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  displayField: TPath;
};

export default function Select<T extends BaseModel>({
  options,
  value,
  onChange,
  displayField,
}: SelectProps<T>) {
  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div>
          <Listbox.Button className="text-white w-40 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex space-x-2 items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <span className="w-full text-left">
              {value[displayField] as string}
            </span>
            <ChevronDownIcon className="w-5 h-5" />
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute z-20 w-48 mt-2 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
              <Listbox.Options className="p-1 text-sm max-h-[75vh] overflow-y-auto">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none block py-2 pl-8 pr-4 text-left',
                        active
                          ? 'bg-gray-100 dark:bg-gray-600 dark:text-white'
                          : 'text-gray-500 dark:text-gray-200'
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="block truncate">
                          {option[displayField] as string}
                        </span>

                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-blue-600 dark:text-blue-400">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
