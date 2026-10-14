import type { ReactNode } from 'react';

export function EmptyView({ children }: { children: ReactNode }) {
  return (
    <div className="mx-2 mt-6 rounded-md border border-border bg-background px-6 py-12 text-center text-muted-foreground sm:mx-0">
      {children}
    </div>
  );
}
