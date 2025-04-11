import { ChevronRightIcon } from 'lucide-react';
import type {
  ButtonProps,
  DisclosureGroupProps,
  DisclosurePanelProps,
  DisclosureProps,
} from 'react-aria-components';
import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { focusVisibleStyles } from './_styles';

const accordionSummaryStyles = tv({
  base: [
    focusVisibleStyles,
    'group border border-accent-7 bg-accent-3 transition-colors hover:bg-accent-4',
    'inline-flex items-center gap-x-2',
    'px-2 py-1',
  ],
});

const accordionDetailsStyles = tv({
  base: 'mt-2 aria-hidden:mt-0',
});

namespace AccordionGroup {
  export interface Props extends DisclosureGroupProps {}
}

export function AccordionGroup(props: AccordionGroup.Props) {
  return <DisclosureGroup {...props} />;
}

namespace Accordion {
  export interface Props extends DisclosureProps {}
}

export function Accordion(props: Accordion.Props) {
  return <Disclosure {...props} />;
}

namespace AccordionSummary {
  export interface Props extends ButtonProps {
    className?: string;
    children: React.ReactNode;
  }
}

export function AccordionSummary({
  className,
  children,
  ...props
}: AccordionSummary.Props) {
  return (
    <Heading className="flex flex-col">
      <Button
        slot="trigger"
        className={accordionSummaryStyles({ className })}
        {...props}
      >
        <ChevronRightIcon className="size-5 transition-transform group-aria-[expanded=true]:rotate-90" />
        <div>{children}</div>
      </Button>
    </Heading>
  );
}

namespace AccordionDetails {
  export interface Props extends DisclosurePanelProps {
    className?: string;
  }
}

export function AccordionDetails({
  className,
  ...props
}: AccordionDetails.Props) {
  return (
    <DisclosurePanel
      className={accordionDetailsStyles({ className })}
      {...props}
    />
  );
}
