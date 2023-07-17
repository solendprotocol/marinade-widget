import React, { PropsWithChildren } from 'react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';

import { clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import { AutoConnectProvider, useAutoConnect } from './AutoConnectProvider';
import { NetworkConfigurationProvider, useNetworkConfiguration } from './NetworkConfigurationProvider';

// Built in wallets
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { GlowWalletAdapter } from '@solana/wallet-adapter-glow';
import { PreferredExplorerProvider } from './preferredExplorer';
import { IInit } from 'src/types';

const WalletContextProvider: FC<{ endpoint?: string; children: ReactNode }> = ({ endpoint, children }) => {
  const { autoConnect } = useAutoConnect();
  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;
  const selectedEndpoint: string = useMemo(() => endpoint ?? clusterApiUrl(network), [network]);

  const passThroughWallet = (() => {
    if (typeof window === 'undefined') return undefined;
    return window.Marinade.passThroughWallet;
  })();

  const wallets = useMemo(() => {
    if (passThroughWallet) {
      return [];
    }

    return [new SolflareWalletAdapter(), new GlowWalletAdapter()];
  }, [network]);

  const onError = useCallback((error: WalletError) => {
    console.error({ type: 'error', message: error.message ? `${error.name}: ${error.message}` : error.name });
  }, []);

  return (
    <ConnectionProvider endpoint={selectedEndpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: React.FC<PropsWithChildren<IInit>> = ({ endpoint, defaultExplorer, children }) => {
  return (
    <>
      <NetworkConfigurationProvider>
        <AutoConnectProvider>
          <WalletContextProvider endpoint={endpoint}>
            <PreferredExplorerProvider defaultExplorer={defaultExplorer}>{children}</PreferredExplorerProvider>
          </WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigurationProvider>
    </>
  );
};
