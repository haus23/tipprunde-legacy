export const selectionPopupStyles =
  'max-h-60 w-(--anchor-width) overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-hidden';

export const selectionItemStyles =
  'relative flex cursor-default select-none items-center rounded-sm py-2 pr-3 pl-8 text-sm outline-hidden data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground data-[selected]:font-semibold';

export type SelectionOption = {
  id: string;
  name: string;
};
