import Logo from './logo';

export default function SplashScreen() {
  return (
    <div className="absolute z-50 flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex w-48 flex-col items-center gap-y-6 sm:w-64">
        <span className="px-6 text-4xl font-semibold">runde.tips</span>
        <Logo className="w-48 sm:w-64" />
      </div>
    </div>
  );
}
