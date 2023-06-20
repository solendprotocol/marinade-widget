import React from 'react';

import { Wallet } from '@solana/wallet-adapter-react';

import { DEFAULT_EXPLORER, FormProps, PaletteType } from 'src/types';

import WalletDisconnectedGraphic from 'src/icons/WalletDisconnectedGraphic';

const ModalTerminal = (props: {
  rpcUrl: string;
  formProps: FormProps;
  palette: PaletteType;
  fakeWallet: Wallet | null;
  defaultExplorer: DEFAULT_EXPLORER;
}) => {
  const {
    rpcUrl,
    formProps,
    fakeWallet,
    palette,
    defaultExplorer
  } = props;
  
  const launchTerminal = () => {
    window.Jupiter.init({
      endpoint: rpcUrl,
      formProps,
      palette,
      passThroughWallet: fakeWallet,
      defaultExplorer
    });
  };

  return (
    <div
      className="p-4 hover:bg-white/10 rounded-xl cursor-pointer flex h-full w-full flex-col items-center justify-center text-[#4A5568]"
      onClick={launchTerminal}
    >
      <WalletDisconnectedGraphic />
      <span className="text-xs mt-4">Launch Terminal Modal</span>
    </div>
  );
};

export default ModalTerminal;
