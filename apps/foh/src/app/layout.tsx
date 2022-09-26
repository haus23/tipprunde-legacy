import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-full">
      <header>
        <h1 className="mx-4 py-4 text-3xl font-semibold">runde.tips</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
