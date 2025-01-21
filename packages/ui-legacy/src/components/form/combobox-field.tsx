import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController,
} from 'react-hook-form';

import { classNames } from '../../utils/class-names';

export type ComboboxFieldProps<
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
  filter: (query: string, option: Option) => boolean;
};

export function ComboboxField<
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
  filter,
}: ComboboxFieldProps<T, TPath, Option, OptionPath>) {
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const [query, setQuery] = useState('');

  const filteredOptions =
    query === '' ? options : options.filter((option) => filter(query, option));

  return (
    <Combobox as="div" value={value} onChange={onChange}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {label}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(value: string) =>
            options.find((option) => option[valueField || 'id'] === value)?.[
              displayField || 'name'
            ] ?? ''
          }
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-hidden sm:text-sm">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option.id}
                value={option[valueField || 'id']}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        'block truncate',
                        selected && 'font-semibold',
                      )}
                    >
                      {option[displayField || 'name']}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 left-0 flex items-center pl-1.5',
                          active ? 'text-white' : 'text-indigo-600',
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
