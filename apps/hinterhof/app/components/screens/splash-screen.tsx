import { tv } from 'tailwind-variants';

import { Logo } from '../logo';

const styles = tv({ base: 'min-h-svh grid place-content-center' });

namespace SplashScreen {
  export interface Props extends React.ComponentProps<'div'> {}
}

export function SplashScreen({ className, ...props }: SplashScreen.Props) {
  return (
    <div className={styles({ className })} {...props}>
      <Logo className="size-64 text-primary/80 md:size-96" />
      <span className="block text-center font-medium text-4xl tracking-wide md:text-5xl">
        runde.tips
      </span>
    </div>
  );
}
