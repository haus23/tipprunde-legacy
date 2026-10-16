import { ChevronRightIcon } from 'lucide-react';
import { cn } from '#/utils/cn';
import { focusVisibleStyles } from './_styles';

// Native disclosure (details/summary): no JS, and find in page opens a
// closed panel. Opening and closing animate where the browser can
// interpolate to `height: auto`, otherwise the panel just toggles.

namespace Accordion {
  export interface Props {
    children: React.ReactNode;
    defaultOpen?: boolean;
  }
}

export function Accordion({ children, defaultOpen }: Accordion.Props) {
  return (
    <details
      // Only the initial state; afterwards the browser owns it
      open={defaultOpen}
      className="group details-content:h-0 details-content:overflow-hidden details-content:opacity-0 details-content:transition-[height,opacity,content-visibility] details-content:transition-discrete details-content:duration-200 [interpolate-size:allow-keywords] open:details-content:h-auto open:details-content:opacity-100 motion-reduce:details-content:transition-none"
    >
      {children}
    </details>
  );
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
    <summary
      className={cn(
        focusVisibleStyles,
        'flex cursor-default list-none items-center gap-x-2 border border-accent-border/60 bg-highlight px-2 py-1 text-accent-strong transition-colors hover:bg-selected group-open:bg-selected max-sm:rounded-none max-sm:px-4 [&::-webkit-details-marker]:hidden',
      )}
    >
      <ChevronRightIcon
        className="size-5 transition-transform group-open:rotate-90 motion-reduce:transition-none"
        aria-hidden="true"
      />
      <div className={className}>{children}</div>
    </summary>
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
  return <div className={className}>{children}</div>;
}
