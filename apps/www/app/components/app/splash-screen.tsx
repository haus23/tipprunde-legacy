import { Logo } from '../logo';

export function SplashScreen() {
  return (
    <div className="grid min-h-svh place-items-center">
      <div className="flex flex-col items-center">
        <Logo className="size-64 text-accent-12 md:size-80" />
        <span className="font-medium text-4xl md:text-5xl">runde.tips</span>
      </div>
    </div>
  );
}
