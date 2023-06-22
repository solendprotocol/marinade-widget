import React, { FC, MouseEvent } from 'react';
import { WalletListItem } from './WalletListItem';
import { Adapter, WalletReadyState } from '@solana/wallet-adapter-base';

import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import LeftArrowIcon from 'src/icons/LeftArrowIcon';
import { useTheme } from 'src/contexts/ThemeProvider';

const PRIORITISE: {
  [value in WalletReadyState]: number;
} = {
  [WalletReadyState.Installed]: 1,
  [WalletReadyState.Loadable]: 2,
  [WalletReadyState.NotDetected]: 3,
  [WalletReadyState.Unsupported]: 3,
};
export interface WalletModalProps {
  setIsWalletModalOpen(toggle: boolean): void;
}

export const WalletModal: FC<WalletModalProps> = ({ setIsWalletModalOpen }) => {
  const { wallets, select } = useWallet();
  const { palette } = useTheme();

  const handleWalletClick = async (event: MouseEvent, wallet: Adapter) => {
    event.preventDefault();

    try {
      // Might throw WalletReadyState.WalletNotReady
      select(wallet.name);

      if (wallet.readyState === WalletReadyState.NotDetected) {
        throw WalletReadyState.NotDetected;
      }
      setIsWalletModalOpen(false);
    } catch (error) {
      // TODO: A small toast or something to indicate the error
    }
  };

  const renderWalletList = (walletList: WalletContextState['wallets']) => (
    <div className="h-full overflow-y-auto space-y-2 webkit-scrollbar" translate="no">
      {walletList.map((wallet, index) => {
        return (
          <ul key={index}>
            <WalletListItem handleClick={(event) => handleWalletClick(event, wallet.adapter)} wallet={wallet.adapter} />
          </ul>
        );
      })}
    </div>
  );

  return (
    <div
      className="flex flex-col h-full w-full p-4 font-bold"
      style={{
        background: palette.primaryBg,
      }}
    >
      <div className="flex w-full justify-between">
        <div
          className="fill-current w-6 h-6 cursor-pointer"
          onClick={() => setIsWalletModalOpen(false)}
          style={{
            color: palette.text,
          }}
        >
          <LeftArrowIcon width={24} height={24} />
        </div>

        <div
          style={{
            color: palette.text,
          }}
        >
          Connect Wallet
        </div>

        <div className=" w-6 h-6" />
      </div>

      <div className="mt-7 overflow-auto">
        {renderWalletList(wallets.sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState]))}
      </div>
    </div>
  );
};
