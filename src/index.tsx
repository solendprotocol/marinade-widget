import React from 'react';

import MarinadeApp from './components/MarinadeApp';
import { ContextProvider } from './contexts/ContextProvider';
import { ScreenProvider } from './contexts/ScreenProvider';
import { DataProvider } from './contexts/DataProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import { TokenContextProvider } from './contexts/TokenContextProvider';
import WalletPassthroughProvider from './contexts/WalletPassthroughProvider';
import { IInit } from './types';

const RenderMarinade = (props: IInit) => {
  return (
    <ContextProvider {...props}>
      <WalletPassthroughProvider>
        <TokenContextProvider {...props}>
          <ScreenProvider>
            <ThemeProvider {...props}>
              <DataProvider {...props}>
                <MarinadeApp />
              </DataProvider>
            </ThemeProvider>
          </ScreenProvider>
        </TokenContextProvider>
      </WalletPassthroughProvider>
    </ContextProvider>
  );
};

export { RenderMarinade };
