import { HeadContent } from '@tanstack/react-router';
import { createContext, use, useCallback, useEffect, useState } from 'react';
import { useDropStaticTitle } from '#/utils/app/title';
import { AppHeader, BareHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { Backdrop } from './backdrop';

const mainStyles = 'mx-auto max-w-5xl pt-20 pb-10 sm:px-6 lg:px-8';

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

// Whether a component renders inside the app shell.
export function useIsInAppShell() {
  return use(ShellContext) !== undefined;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isChampionshipSelectOpen, setChampionshipSelectOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setChampionshipSelectOpen((prev) => !prev);
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
      <div className="relative min-h-svh">
        <AppHeader />
        <AppSidebar />
        <main className={mainStyles}>{children}</main>
      </div>
    </ShellContext>
  );
}

// Shell without championship data, for errors before they are loaded. It
// brings its own gradient, as such an error replaces the root component.
export function BareShell({ children }: { children: React.ReactNode }) {
  useDropStaticTitle();
  return (
    <>
      <HeadContent />
      <Backdrop />
      <div className="relative min-h-svh">
        <BareHeader />
        <main className={mainStyles}>{children}</main>
      </div>
    </>
  );
}
