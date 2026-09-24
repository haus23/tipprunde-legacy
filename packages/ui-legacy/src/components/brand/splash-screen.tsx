import { Logo } from './logo';

type SplashScreenProps = {
  message?: string;
};

export function SplashScreen({ message }: SplashScreenProps) {
  return (
    <div className="absolute z-50 flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex w-48 flex-col items-center gap-y-6 sm:w-64">
        <span className="px-6 font-semibold text-4xl">runde.tips</span>
        <Logo className="w-48 sm:w-64" />
        {message && <p className="font-semibold text-lg">{message}</p>}
      </div>
    </div>
  );
}
