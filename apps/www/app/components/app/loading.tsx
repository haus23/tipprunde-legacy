import { LoaderCircleIcon } from 'lucide-react';
import { useDropStaticTitle } from '#/utils/app/title';
import { BareShell } from './app-shell';

// Quiet loading hint at the top of the page content.
export function LoadingView() {
  return (
    <div className="flex items-center justify-center gap-x-2 py-12 text-muted-foreground">
      <LoaderCircleIcon
        className="size-5 animate-spin motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span role="status">Lade Daten …</span>
    </div>
  );
}

// Shown by the root route while the championships load (first visit, slow
// network). There is no app shell yet, so it brings the bare shell.
export function RootPendingComponent() {
  useDropStaticTitle();
  return (
    <BareShell>
      {/* The routes' titles are not known yet */}
      <title>runde.tips</title>
      <LoadingView />
    </BareShell>
  );
}
