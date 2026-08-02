import { createContext, ReactElement, useContext } from 'react';

export type GlobalLayoutState = {
  isNavbarVisible: boolean;
  wasNavbarVisible: boolean;
};

export const GlobalLayoutStateContext = createContext<GlobalLayoutState | undefined>(undefined);

export const useGlobalLayoutState = (): GlobalLayoutState => {
  const context = useContext(GlobalLayoutStateContext);
  if (!context) {
    throw new Error('Attempted to use GlobalLayoutStateContext without a provider!');
  }

  return context;
};

export type GlobalLayoutActions = {
  setIsBannerVisible: (b: boolean) => void;
  setTopNavContent: (e: ReactElement | null) => void;
  setSidebarContent: (e: ReactElement | null) => void;
};

export const GlobalLayoutActionsContext = createContext<GlobalLayoutActions | undefined>(undefined);

export const useGlobalLayoutActions = (): GlobalLayoutActions => {
  const context = useContext(GlobalLayoutActionsContext);
  if (!context) {
    throw new Error('Attempted to use GlobalLayoutActionsContext without a provider!');
  }

  return context;
};
