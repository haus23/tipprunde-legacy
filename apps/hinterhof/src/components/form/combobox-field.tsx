import { Combobox } from '@base-ui/react/combobox';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { useId, useMemo, useRef } from 'react';
import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController,
} from 'react-hook-form';
import { Field, FieldLabel, fieldControlStyles } from './field';
import {
  type SelectionOption,
  selectionItemStyles,
  selectionPopupStyles,
} from './selection';

type ComboboxFieldProps<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>,
  Option extends SelectionOption,
> = {
  control: Control<T>;
  filter: (query: string, option: Option) => boolean;
  label: string;
  name: TPath;
  options: readonly Option[];
};

export default function ComboboxField<
  T extends FieldValues,
  TPath extends FieldPathByValue<T, string>,
  Option extends SelectionOption,
>({
  control,
  filter,
  label,
  name,
  options,
}: ComboboxFieldProps<T, TPath, Option>) {
  const { field } = useController({ control, name });
  const id = `${useId()}-${field.name}`;
  const highlightedValueRef = useRef<string>(undefined);
  const items = useMemo(() => {
    const normalizedOptions = options.map((option) => ({
      id: option.id,
      name: option.name,
      option,
    }));

    return Combobox.createItems(normalizedOptions, {
      getLabel: ({ name }) => name,
      getValue: ({ id }) => id,
    });
  }, [options]);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Combobox.Root
        name={field.name}
        items={items}
        autoHighlight
        value={field.value || null}
        onValueChange={(value) => field.onChange(value ?? '')}
        onItemHighlighted={(value) => {
          highlightedValueRef.current = value;
        }}
        onOpenChange={(open) => {
          if (!open) highlightedValueRef.current = undefined;
        }}
        filter={({ option }, query) => filter(query, option)}
      >
        <div className="relative">
          <Combobox.Input
            id={id}
            ref={field.ref}
            onBlur={field.onBlur}
            onKeyDownCapture={(event) => {
              if (event.key === 'Tab' && highlightedValueRef.current) {
                field.onChange(highlightedValueRef.current);
              }
            }}
            className={fieldControlStyles({ className: 'pr-20' })}
          />
          <Combobox.Clear
            aria-label="Auswahl löschen"
            title="Auswahl löschen"
            className="absolute inset-y-0 right-10 flex items-center px-2 text-muted-foreground/60 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <XIcon className="size-4" aria-hidden="true" />
          </Combobox.Clear>
          <Combobox.Trigger className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring">
            <ChevronsUpDownIcon className="size-5" aria-hidden="true" />
          </Combobox.Trigger>
        </div>
        <Combobox.Portal>
          <Combobox.Positioner className="z-50" sideOffset={4} align="start">
            <Combobox.Popup className={selectionPopupStyles}>
              <Combobox.Empty className="p-2 text-muted-foreground text-sm">
                Kein Eintrag gefunden.
              </Combobox.Empty>
              <Combobox.List>
                {(option) => (
                  <Combobox.Item
                    key={option.id}
                    value={option.id}
                    className={selectionItemStyles}
                  >
                    <Combobox.ItemIndicator className="absolute left-2">
                      <CheckIcon className="size-4" aria-hidden="true" />
                    </Combobox.ItemIndicator>
                    <span className="truncate">{option.name}</span>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field>
  );
}
