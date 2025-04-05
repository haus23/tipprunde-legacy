import { tv } from 'tailwind-variants';

const tableStyles = tv({});

namespace Table {
  export interface Props extends React.ComponentProps<'table'> {}
}

export function Table({ className, ...props }: Table.Props) {
  return <table className={tableStyles({ className })} {...props} />;
}

const tableHeaderStyles = tv({});

namespace TableHeader {
  export interface Props extends React.ComponentProps<'thead'> {}
}

export function TableHeader({ className, ...props }: TableHeader.Props) {
  return <thead className={tableHeaderStyles({ className })} {...props} />;
}

const tableBodyStyles = tv({});

namespace TableBody {
  export interface Props extends React.ComponentProps<'tbody'> {}
}

export function TableBody({ className, ...props }: TableBody.Props) {
  return <tbody className={tableBodyStyles({ className })} {...props} />;
}

const tableFooterStyles = tv({});

namespace TableFooter {
  export interface Props extends React.ComponentProps<'tfoot'> {}
}

export function TableFooter({ className, ...props }: TableFooter.Props) {
  return <tfoot className={tableFooterStyles({ className })} {...props} />;
}

const tableRowStyles = tv({});

namespace TableRow {
  export interface Props extends React.ComponentProps<'tr'> {}
}

export function TableRow({ className, ...props }: TableRow.Props) {
  return <tr className={tableRowStyles({ className })} {...props} />;
}

const tableHeadStyles = tv({});

namespace TableHead {
  export interface Props extends React.ComponentProps<'th'> {}
}

export function TableHead({ className, ...props }: TableHead.Props) {
  return <th className={tableHeadStyles({ className })} {...props} />;
}

const tableCellStyles = tv({});

namespace TableCell {
  export interface Props extends React.ComponentProps<'td'> {}
}

export function TableCell({ className, ...props }: TableCell.Props) {
  return <td className={tableCellStyles({ className })} {...props} />;
}

const tableCaptionStyles = tv({});

namespace TableCaption {
  export interface Props extends React.ComponentProps<'caption'> {}
}

export function TableCaption({ className, ...props }: TableCaption.Props) {
  return <caption className={tableCaptionStyles({ className })} {...props} />;
}
