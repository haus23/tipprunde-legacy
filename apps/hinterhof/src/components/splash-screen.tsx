import Logo from './logo';

type SplashScreenProps = {
  message: string;
};

export default function SplashScreen({ message }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-50 grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div
        className="flex w-48 flex-col items-center gap-y-6 text-center sm:w-64"
        role="status"
        aria-live="polite"
      >
        <span className="font-semibold text-4xl tracking-tight">
          runde.tips
        </span>
        <Logo className="w-48 text-brand sm:w-64" />
        <p className="min-h-7 w-full font-medium text-lg text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}
