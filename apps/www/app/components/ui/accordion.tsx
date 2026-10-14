import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ChevronRightIcon } from 'lucide-react';
import { cn } from '#/utils/cn';
import { focusVisibleStyles } from './_styles';

namespace AccordionGroup {
  export interface Props {
    children: React.ReactNode;
    className?: string;
    defaultValue?: string[];
    multiple?: boolean;
  }
}

export function AccordionGroup({
  children,
  className,
  defaultValue,
  multiple,
}: AccordionGroup.Props) {
  return (
    <BaseAccordion.Root
      multiple={multiple}
      defaultValue={defaultValue}
      className={className}
    >
      {children}
    </BaseAccordion.Root>
  );
}

namespace Accordion {
  export interface Props {
    children: React.ReactNode;
    value: string;
  }
}

export function Accordion({ children, value }: Accordion.Props) {
  return <BaseAccordion.Item value={value}>{children}</BaseAccordion.Item>;
}

namespace AccordionSummary {
  export interface Props {
    children: React.ReactNode;
    className?: string;
  }
}

export function AccordionSummary({
  children,
  className,
}: AccordionSummary.Props) {
  return (
    <BaseAccordion.Header className="flex flex-col">
      <BaseAccordion.Trigger
        className={cn(
          focusVisibleStyles,
          'group flex items-center gap-x-2 border border-accent-border/60 bg-highlight px-2 py-1 text-accent-strong transition-colors hover:bg-selected data-panel-open:bg-selected max-sm:rounded-none max-sm:px-4',
        )}
      >
        <ChevronRightIcon
          className="size-5 transition-transform group-data-panel-open:rotate-90 motion-reduce:transition-none"
          aria-hidden="true"
        />
        <div className={className}>{children}</div>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

namespace AccordionDetails {
  export interface Props {
    children: React.ReactNode;
    className?: string;
  }
}

export function AccordionDetails({
  children,
  className,
}: AccordionDetails.Props) {
  return (
    <BaseAccordion.Panel
      className={cn(
        'h-(--accordion-panel-height) overflow-hidden transition-[height,opacity] duration-250 data-ending-style:h-0 data-starting-style:h-0 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none',
        className,
      )}
    >
      {children}
    </BaseAccordion.Panel>
  );
}
