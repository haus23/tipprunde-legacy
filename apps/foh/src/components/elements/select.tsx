import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
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
          <Listbox.Button className="text-white w-32 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex space-x-2 items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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
            <div className="absolute w-48 mt-1 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
              <Listbox.Options className="py-1 text-sm text-gray-700 dark:text-gray-200">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option}
                    className="block py-2 px-4 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <span className="select-none">
                      {option[displayField] as string}
                    </span>
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
