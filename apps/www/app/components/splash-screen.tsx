import { tv } from 'tailwind-variants';

import { Logo } from './logo';

const styles = tv({ base: 'grid min-h-svh place-content-center' });

namespace SplashScreen {
  export interface Props extends React.ComponentProps<'div'> {}
}

export function SplashScreen({ className, ...props }: SplashScreen.Props) {
  return (
    <div className={styles({ className })} {...props}>
      <Logo className="size-64 text-accent-12 md:size-80" />
      <span className="block text-center font-medium text-4xl tracking-wide md:text-5xl">
        runde.tips
      </span>
    </div>
  );
}
