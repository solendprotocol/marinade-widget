import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';

type Screens = 'Initial' | 'Success' | 'Error' | 'Staking' | 'Confirming' | 'Signing';

type Context = {
  message?: string;
  callback?: () => void;
};
export interface ScreenProvider {
  screen: Screens;
  context: Context;
  setContext: Dispatch<SetStateAction<Context>>;
  setScreen: Dispatch<SetStateAction<Screens>>;
}

export const ScreenStateContext = createContext<ScreenProvider>({
  screen: 'Initial',
  setScreen() {},
  setContext() {},
  context: {},
});

export function useScreenState(): ScreenProvider {
  return useContext(ScreenStateContext);
}

export const ScreenProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screens>('Initial');
  const [context, setContext] = useState<Context>({});

  return (
    <ScreenStateContext.Provider value={{ screen, setScreen, context, setContext }}>
      {children}
    </ScreenStateContext.Provider>
  );
};
