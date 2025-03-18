import type { Championship } from '@haus23/tipprunde-model';

namespace EmptyData {
  export interface Props extends React.ComponentProps<'div'> {
    championship: Championship;
  }
}

export function EmptyData({
  championship,
  children,
  ...props
}: EmptyData.Props) {
  return (
    <div {...props}>
      <header className="mx-2 flex items-center gap-x-2 pt-2 text-accent-foreground sm:mx-0 sm:gap-x-4">
        <title>{`Tabelle ${championship.name} - runde.tips`}</title>
        <h1 className="flex gap-x-2 text-xl font-semibold tracking-tight">
          <span className="hidden sm:block">{championship.name}</span>
          <span className="hidden sm:block">-</span>
          <span>Neues Turnier</span>
        </h1>
      </header>
      <div className="mx-2 mt-4 text-lg text-subtle-foreground">{children}</div>
    </div>
  );
}
