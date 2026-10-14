import { cn } from '#/utils/cn';

const tableStyles = 'w-full';

namespace Table {
  export interface Props extends React.ComponentProps<'table'> {}
}

export function Table({ className, ...props }: Table.Props) {
  return <table className={cn(tableStyles, className)} {...props} />;
}

const tableHeaderStyles = 'bg-selected text-accent-strong text-xs uppercase';

namespace TableHeader {
  export interface Props extends React.ComponentProps<'thead'> {}
}

export function TableHeader({ className, ...props }: TableHeader.Props) {
  return <thead className={cn(tableHeaderStyles, className)} {...props} />;
}

// The pseudo element keeps a small gap between header and first row
const tableBodyStyles =
  "divide-y before:block before:-indent-[9999px] before:leading-[2px] before:content-['@']";

namespace TableBody {
  export interface Props extends React.ComponentProps<'tbody'> {}
}

export function TableBody({ className, ...props }: TableBody.Props) {
  return <tbody className={cn(tableBodyStyles, className)} {...props} />;
}

namespace TableFooter {
  export interface Props extends React.ComponentProps<'tfoot'> {}
}

export function TableFooter({ className, ...props }: TableFooter.Props) {
  return <tfoot className={className} {...props} />;
}

namespace TableRow {
  export interface Props extends React.ComponentProps<'tr'> {}
}

export function TableRow({ className, ...props }: TableRow.Props) {
  return <tr className={className} {...props} />;
}

// TODO: think about md:px-6
// On phones the outer cells keep the page gutter; the table itself stays
// edge to edge.
const tableHeadStyles =
  'p-2 font-medium max-sm:first:pl-4 max-sm:last:pr-4 md:px-4';

namespace TableHead {
  export interface Props extends React.ComponentProps<'th'> {}
}

export function TableHead({ className, ...props }: TableHead.Props) {
  return <th className={cn(tableHeadStyles, className)} {...props} />;
}

const tableCellStyles = 'p-1 max-sm:first:pl-4 max-sm:last:pr-4 md:px-4';

namespace TableCell {
  export interface Props extends React.ComponentProps<'td'> {}
}

export function TableCell({ className, ...props }: TableCell.Props) {
  return <td className={cn(tableCellStyles, className)} {...props} />;
}

namespace TableCaption {
  export interface Props extends React.ComponentProps<'caption'> {}
}

export function TableCaption({ className, ...props }: TableCaption.Props) {
  return <caption className={className} {...props} />;
}
