import {
  type ComponentProps,
  type Dispatch,
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
} from 'react';

type LayoutContext = {
  isSidebarOpen: boolean;
  setSidebarOpen: Dispatch<React.SetStateAction<boolean>>;
  isChampionshipSelectOpen: boolean;
  setChampionshipSelectOpen: Dispatch<React.SetStateAction<boolean>>;
};

const LayoutContext = createContext<LayoutContext>(undefined as never);

export function useLayout() {
  const context = use(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within the AppLayout.');
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

namespace AppLayout {
  export interface Props extends ComponentProps<'div'> {}
}

export function AppLayout({ ...props }: AppLayout.Props) {
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
    <LayoutContext
      value={{
        isSidebarOpen,
        setSidebarOpen,
        isChampionshipSelectOpen,
        setChampionshipSelectOpen,
      }}
    >
      <div {...props} />
    </LayoutContext>
  );
}
