import Logo from '../logo';

export default function AppTitle() {
  return (
    <div className="flex flex-shrink-0 items-center px-4 gap-x-2">
      <Logo className="h-8 w-auto" />
      <h1 className="text-2xl font-semibold">runde.tips</h1>
    </div>
  );
}
