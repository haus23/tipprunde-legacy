import { type ComponentProps, type Dispatch, createContext, use, useCallback, useState } from 'react';

type LayoutContext = {
  isSidebarOpen: boolean;
  setSidebarOpen: Dispatch<React.SetStateAction<boolean>>;
};

const LayoutContext = createContext<LayoutContext>(undefined as never);

export function useLayout() {
  const context = use(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within the AppLayout.');
  }

  const { isSidebarOpen, setSidebarOpen } = context;
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(state => !state);
  }, [setSidebarOpen]);

  return {isSidebarOpen, setSidebarOpen, toggleSidebar};
}

namespace AppLayout {
  export interface Props extends ComponentProps<'div'> {}
}

export function AppLayout({ ...props }: AppLayout.Props) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LayoutContext value={{ isSidebarOpen, setSidebarOpen }}>
      <div {...props} />
    </LayoutContext>
  );
}
