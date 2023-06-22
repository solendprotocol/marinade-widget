import React, { useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { useScreenState } from 'src/contexts/ScreenProvider';
import { IInit } from 'src/types';
import { USDValueProvider } from 'src/contexts/USDValueProvider';

import Header from './Header';
import { AccountsProvider } from '../contexts/accounts';
import InitialScreen from './screens/InitialScreen';
import ActionScreen from './screens/ActionScreen';

const Content = () => {
  const { screen } = useScreenState();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [showStakeModeSettings, setShowStakeModeSettings] = useState(false);
  const [showDelegationStrategy, setShowDelegationStrategy] = useState(false);

  return (
    <>
      {screen === 'Initial' ? (
        <>
          <Header
            setIsWalletModalOpen={setIsWalletModalOpen}
            setShowStakeModeSettings={setShowStakeModeSettings}
            setShowDelegationStrategy={setShowDelegationStrategy}
          />
          <InitialScreen
            showStakeModeSettings={showStakeModeSettings}
            setShowStakeModeSettings={setShowStakeModeSettings}
            showDelegationStrategy={showDelegationStrategy}
            setShowDelegationStrategy={setShowDelegationStrategy}
            isWalletModalOpen={isWalletModalOpen}
            setIsWalletModalOpen={setIsWalletModalOpen}
          />
        </>
      ) : (
        <ActionScreen />
      )}
    </>
  );
};

const queryClient = new QueryClient();

const MarinadeApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AccountsProvider>
        <USDValueProvider>
          <Content />
        </USDValueProvider>
      </AccountsProvider>
    </QueryClientProvider>
  );
};

export default MarinadeApp;
