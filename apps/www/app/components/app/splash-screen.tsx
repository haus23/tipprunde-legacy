import { Logo } from '../logo';

export function SplashScreen() {
  return (
    <div className="grid min-h-svh place-content-center">
      <Logo className="size-64 text-accent-12 md:size-80" />
      <span className="block text-center font-medium text-4xl tracking-wide md:text-5xl">
        runde.tips
      </span>
    </div>
  );
}
