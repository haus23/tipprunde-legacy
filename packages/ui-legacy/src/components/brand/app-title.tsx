import { Logo } from './logo';

export function AppTitle() {
  return (
    <div className="flex items-center gap-x-2">
      <Logo className="h-8 w-auto" />
      <h1 className="hidden xs:block text-2xl font-semibold">runde.tips</h1>
    </div>
  );
}
