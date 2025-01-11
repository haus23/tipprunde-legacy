import { tv } from 'tailwind-variants';

import { Logo } from './logo';

const styles = tv({ base: 'min-h-svh grid place-content-center' });

namespace SplashScreen {
  export interface Props extends React.ComponentProps<'div'> {}
}

export function SplashScreen({ className, ...props }: SplashScreen.Props) {
  return (
    <div className={styles({ className })} {...props}>
      <Logo className="size-64 md:size-80 text-primary-foreground" />
      <span className="block text-center text-4xl tracking-wide md:text-5xl font-medium">
        runde.tips
      </span>
    </div>
  );
}
