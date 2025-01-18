import { Logo } from 'ui-legacy';

export default function CurrentShellFallback() {
  return (
    <div className="fixed inset-0 md:left-64 flex flex-col items-center justify-center">
      <Logo className="w-24 h-24 text-gray-800" />
      <p className="mt-4 text-lg font-semibold">Lade Daten des Turniers ...</p>
    </div>
  );
}
