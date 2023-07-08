import React, { useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useScreenState } from 'src/contexts/ScreenProvider';
import { USDValueProvider } from 'src/contexts/USDValueProvider';
import Header from './Header';
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
      <USDValueProvider>
        <Content />
      </USDValueProvider>
    </QueryClientProvider>
  );
};

export default MarinadeApp;
