import { Select as BaseSelect } from '@base-ui/react/select';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useId } from 'react';
import { Field, FieldLabel, fieldControlStyles } from './field';
import { type SelectionOption, selectionItemStyles } from './selection';

const popupStyles =
  'w-(--anchor-width) overflow-hidden rounded-md border border-border/60 bg-popover text-popover-foreground shadow-lg outline-hidden';

const listStyles =
  'max-h-[min(15rem,var(--available-height))] overflow-y-auto overscroll-contain p-1';

type SelectProps<Option extends SelectionOption> = {
  'aria-label'?: string;
  label?: string;
  name?: string;
  onBlur?: () => void;
  onValueChange: (value: string) => void;
  options: readonly Option[];
  ref?: React.Ref<HTMLButtonElement>;
  value: string;
};

export default function Select<Option extends SelectionOption>({
  'aria-label': ariaLabel,
  label,
  name,
  onBlur,
  onValueChange,
  options,
  ref,
  value,
}: SelectProps<Option>) {
  const generatedId = useId();
  const id = `${generatedId}-${name ?? 'select'}`;

  const control = (
    <BaseSelect.Root
      name={name}
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue !== null) onValueChange(nextValue);
      }}
    >
      {label && (
        <BaseSelect.Label render={<FieldLabel htmlFor={id} />}>
          {label}
        </BaseSelect.Label>
      )}
      <BaseSelect.Trigger
        id={id}
        ref={ref}
        aria-label={ariaLabel}
        onBlur={onBlur}
        className={fieldControlStyles({
          className:
            'flex items-center justify-between text-left data-[popup-open]:border-ring',
        })}
      >
        <BaseSelect.Value>
          {(selectedValue: string | null) =>
            options.find((option) => option.id === selectedValue)?.name ?? ''
          }
        </BaseSelect.Value>
        <BaseSelect.Icon>
          <ChevronsUpDownIcon
            className="size-5 text-muted-foreground"
            aria-hidden="true"
          />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          className="z-50"
          alignItemWithTrigger={false}
          sideOffset={4}
          align="start"
          collisionAvoidance={{
            side: 'flip',
            align: 'shift',
            fallbackAxisSide: 'none',
          }}
        >
          <BaseSelect.Popup className={popupStyles}>
            <BaseSelect.List className={listStyles}>
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.id}
                  value={option.id}
                  className={selectionItemStyles}
                >
                  <BaseSelect.ItemIndicator className="absolute left-2">
                    <CheckIcon className="size-4" aria-hidden="true" />
                  </BaseSelect.ItemIndicator>
                  <BaseSelect.ItemText>{option.name}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );

  return label ? <Field>{control}</Field> : control;
}
