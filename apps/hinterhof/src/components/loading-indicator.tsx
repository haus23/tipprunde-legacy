import { LoaderCircleIcon } from 'lucide-react';
import { cn } from '#/utils/cn';

// Small spinner with a message for loading inside the app layout. Splash
// screens cover the initial app load.
export default function LoadingIndicator({
  className,
  message,
}: {
  className?: string;
  message: string;
}) {
  return (
    <p
      role="status"
      className={cn(
        'flex items-center gap-x-2 text-muted-foreground text-sm',
        className,
      )}
    >
      <LoaderCircleIcon
        className="size-4 shrink-0 animate-spin motion-reduce:animate-none"
        aria-hidden="true"
      />
      {message}
    </p>
  );
}
