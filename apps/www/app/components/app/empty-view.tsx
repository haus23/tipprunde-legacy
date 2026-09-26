import type { ReactNode } from 'react';

export function EmptyView({ children }: { children: ReactNode }) {
  return (
    <div className="mx-2 mt-6 rounded-md border border-gray-6 bg-background px-6 py-12 text-center text-gray-11 sm:mx-0">
      {children}
    </div>
  );
}
