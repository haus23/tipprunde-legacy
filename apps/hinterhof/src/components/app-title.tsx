import Logo from './logo';

export default function AppTitle() {
  return (
    <div className="flex items-center gap-x-2">
      <Logo className="h-8 w-auto text-brand" />
      <h1 className="xs:block hidden font-semibold text-2xl text-foreground">
        runde.tips
      </h1>
    </div>
  );
}
