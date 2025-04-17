import { createContext, use } from 'react';

type ActionContextType = {
  onAction: () => void;
};

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export function useActionContext() {
  const context = use(ActionContext);

  return context;
}

namespace ActionProvider {
  export interface Props {
    onAction: () => void;
    children: React.ReactNode;
  }
}

export function ActionProvider({ onAction, children }: ActionProvider.Props) {
  return <ActionContext value={{ onAction }}>{children}</ActionContext>;
}
