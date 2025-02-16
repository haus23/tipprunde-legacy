import LogoImage from '@/assets/logo.svg?no-inline';
import { cn } from '@/utils/cn';

namespace Logo {
  export interface Props extends React.ComponentProps<'svg'> {}
}

export function Logo({ className, ...props }: Logo.Props) {
  return (
    <svg
      role="img"
      aria-label="Haus 23 Logo"
      className={cn('size-full fill-current', className)}
    >
      <use href={`${LogoImage}#logo`} />
    </svg>
  );
}
