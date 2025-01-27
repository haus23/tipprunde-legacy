import { cn } from '@/utils/cn';
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  LoaderIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as ToasterPrimitive, type ToasterProps } from 'sonner';

namespace Toaster {
  export interface Props extends ToasterProps {}
}

export function Toaster({ ...props }: Toaster.Props) {
  return (
    <ToasterPrimitive
      richColors
      icons={{
        info: <InfoIcon />,
        warning: <TriangleAlertIcon />,
        error: <CircleAlertIcon />,
        success: <CircleCheckIcon />,
        loading: <LoaderIcon className="animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            'flex items-center gap-x-3 w-full rounded-xl p-4',
            'inset-ring-1 inset-ring-current/10 backdrop-blur-3xl',
          ),
          default: 'bg-background text-foreground/70',
        },
      }}
      {...props}
    />
  );
}
