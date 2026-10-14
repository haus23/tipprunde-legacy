import { Combobox } from '@base-ui/react/combobox';
import { CheckIcon, ChevronsUpDownIcon, PlusIcon, XIcon } from 'lucide-react';
import { useId, useMemo, useRef } from 'react';
import { focusRing, focusRingInset } from '#/styles/focus';
import { cn } from '#/utils/cn';
import { Field, FieldLabel, fieldControlStyles } from './field';
import {
  type SelectionOption,
  selectionItemStyles,
  selectionPopupStyles,
} from './selection';

type ComboboxFieldProps<Option extends SelectionOption> = {
  /** Adds a plus button that creates a missing option, e.g. in a dialog. */
  create?: { label: string; onCreate: () => void };
  filter: (query: string, option: Option) => boolean;
  label: string;
  name?: string;
  onBlur?: () => void;
  onValueChange: (value: string) => void;
  options: readonly Option[];
  ref?: React.Ref<HTMLInputElement>;
  value: string;
};

export default function ComboboxField<Option extends SelectionOption>({
  create,
  filter,
  label,
  name,
  onBlur,
  onValueChange,
  options,
  ref,
  value,
}: ComboboxFieldProps<Option>) {
  const id = `${useId()}-${name ?? 'combobox'}`;
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
        name={name}
        items={items}
        autoHighlight
        value={value || null}
        onValueChange={(nextValue) => onValueChange(nextValue ?? '')}
        onItemHighlighted={(value) => {
          highlightedValueRef.current = value;
        }}
        onOpenChange={(open) => {
          if (!open) highlightedValueRef.current = undefined;
        }}
        filter={({ option }, query) => filter(query, option)}
      >
        {/* The create button is attached to the field, outside the input */}
        <div className="flex">
          <div className="relative min-w-0 flex-1 focus-within:z-10">
            <Combobox.Input
              id={id}
              ref={ref}
              onBlur={onBlur}
              onKeyDownCapture={(event) => {
                if (event.key === 'Tab' && highlightedValueRef.current) {
                  onValueChange(highlightedValueRef.current);
                }
              }}
              className={fieldControlStyles({
                className: cn('pr-20', create && 'rounded-r-none'),
              })}
            />
            <Combobox.Clear
              aria-label="Auswahl löschen"
              title="Auswahl löschen"
              className={cn(
                focusRingInset,
                'absolute inset-y-0 right-10 flex items-center px-2 text-muted-foreground/60 hover:text-muted-foreground',
              )}
            >
              <XIcon className="size-4" aria-hidden="true" />
            </Combobox.Clear>
            <Combobox.Trigger
              className={cn(
                focusRingInset,
                'absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground',
              )}
            >
              <ChevronsUpDownIcon className="size-5" aria-hidden="true" />
            </Combobox.Trigger>
          </div>
          {create && (
            <button
              type="button"
              aria-label={create.label}
              title={create.label}
              onClick={create.onCreate}
              className={cn(
                focusRing,
                '-ml-px inline-flex w-10 shrink-0 items-center justify-center rounded-r-md border border-primary bg-primary text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:z-10 motion-reduce:transition-none',
              )}
            >
              <PlusIcon className="size-5" aria-hidden="true" />
            </button>
          )}
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
