import { Select as BaseSelect } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '#/utils/cn';
import { componentHoverStyles, focusVisibleStyles } from './_styles';

// Select with plain options or options grouped under a label (e.g. rounds).
// An option may carry a detail shown in the list, but not in the trigger.

export type SelectOption = {
  detail?: React.ReactNode;
  label: string;
  value: string;
};

export type SelectGroup = {
  label: string;
  options: SelectOption[];
  value: string;
};

namespace Select {
  export interface Props {
    'aria-label': string;
    groups?: SelectGroup[];
    name?: string;
    onValueChange: (value: string) => void;
    options?: SelectOption[];
    value: string;
  }
}

function SelectItem({ option }: { option: SelectOption }) {
  return (
    <BaseSelect.Item
      value={option.value}
      className={cn(
        componentHoverStyles,
        'my-1.5 flex select-none items-center justify-between gap-x-4 rounded-sm px-4 py-1.5 outline-hidden data-highlighted:bg-highlight data-highlighted:text-foreground data-selected:text-accent',
      )}
    >
      <span className="flex items-center gap-x-2">
        <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
        {option.detail}
      </span>
      <BaseSelect.ItemIndicator>
        <CheckIcon className="size-5" aria-hidden="true" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export function Select({
  'aria-label': ariaLabel,
  groups,
  name,
  onValueChange,
  options = [],
  value,
}: Select.Props) {
  const allOptions = groups ? groups.flatMap((g) => g.options) : options;
  const labels = Object.fromEntries(allOptions.map((o) => [o.value, o.label]));

  return (
    <BaseSelect.Root
      name={name}
      value={value}
      items={labels}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
    >
      <BaseSelect.Trigger
        aria-label={ariaLabel}
        className={cn(
          focusVisibleStyles,
          'inline-flex grow items-center justify-between border border-accent-border bg-background py-1 pr-2 pl-4 font-medium text-foreground transition-colors hover:bg-highlight data-popup-open:bg-highlight md:grow-0 md:basis-3/4 lg:basis-2/3',
        )}
      >
        <BaseSelect.Value />
        <BaseSelect.Icon>
          <ChevronDownIcon className="size-5 text-accent" aria-hidden="true" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          side="bottom"
          align="start"
          sideOffset={4}
          alignItemWithTrigger={false}
        >
          <BaseSelect.Popup className="max-h-[min(70svh,var(--available-height))] min-w-(--anchor-width) overflow-y-auto rounded-sm bg-background px-2 outline-hidden ring-1 ring-border">
            <BaseSelect.List>
              {groups
                ? groups.map((group) => (
                    <BaseSelect.Group key={group.value}>
                      <BaseSelect.GroupLabel className="px-1 pt-4 text-muted-foreground text-sm">
                        {group.label}
                      </BaseSelect.GroupLabel>
                      {group.options.map((option) => (
                        <SelectItem key={option.value} option={option} />
                      ))}
                    </BaseSelect.Group>
                  ))
                : options.map((option) => (
                    <SelectItem key={option.value} option={option} />
                  ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
