import { createContext, use, useCallback, useEffect, useState } from 'react';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { ChampionshipSelect } from './championship-select';

type ShellContextType = {
  isSidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isChampionshipSelectOpen: boolean;
  setChampionshipSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShellContext = createContext<ShellContextType>(undefined as never);

export function useAppShell() {
  const context = use(ShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within the AppShell.');
  }

  const {
    isSidebarOpen,
    setSidebarOpen,
    isChampionshipSelectOpen,
    setChampionshipSelectOpen,
  } = context;

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((state) => !state);
  }, [setSidebarOpen]);

  return {
    isSidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    isChampionshipSelectOpen,
    setChampionshipSelectOpen,
  };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isChampionshipSelectOpen, setChampionshipSelectOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setChampionshipSelectOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setChampionshipSelectOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ShellContext
      value={{
        isSidebarOpen,
        setSidebarOpen,
        isChampionshipSelectOpen,
        setChampionshipSelectOpen,
      }}
    >
      <div className="releative isolate min-h-svh">
        <AppHeader />
        <AppSidebar />
        <main className="mx-auto max-w-5xl pt-20 pb-10 sm:px-6 lg:px-8">
          {children}
        </main>
        <ChampionshipSelect />
      </div>
    </ShellContext>
  );
}
