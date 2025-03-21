import {
  type ComponentProps,
  type Dispatch,
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
} from 'react';

type ShellContextType = {
  isSidebarOpen: boolean;
  setSidebarOpen: Dispatch<React.SetStateAction<boolean>>;
  isChampionshipSelectOpen: boolean;
  setChampionshipSelectOpen: Dispatch<React.SetStateAction<boolean>>;
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

namespace AppShell {
  export interface Props extends ComponentProps<'div'> {}
}

export function AppShell({ ...props }: AppShell.Props) {
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
      <div {...props} />
    </ShellContext>
  );
}
