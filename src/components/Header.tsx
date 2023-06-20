import React, { useMemo, useState } from 'react';
import { useSlippageConfig } from 'src/contexts/SlippageConfigProvider';
import { useSwapContext } from 'src/contexts/SwapContext';
import { useWalletPassThrough } from 'src/contexts/WalletPassthroughProvider';
import RefreshSVG from 'src/icons/RefreshSVG';
import { TbDroplet, TbSettingsAutomation } from 'react-icons/tb';

import { WalletButton } from './WalletComponents';
import SwapSettingsModal from './SwapSettingsModal/SwapSettingsModal';
import FormPairSelector from './FormPairSelector';
import { useData } from 'src/contexts/DataProvider';

const Header: React.FC<{ 
  setIsWalletModalOpen(toggle: boolean): void;
  setShowStakeModeSettings(arg: boolean): void;
  setShowDelegationStrategy(arg: boolean): void;
}> = ({ setIsWalletModalOpen, setShowDelegationStrategy }) => {
  const { allowDirectStake, delegationStrategy, refresh, palette } = useData();

  return (
    <div className="h-7 mb-4">
      <div className="w-full flex items-center justify-between ">
        <div className="flex space-x-1 items-center">
          {allowDirectStake && <button
            type="button"
            className="p-2 h-7 space-x-1 flex items-center justify-center border rounded-lg	border-white/10 border-solid border-1 fill-current"
            style={{
              borderColor: palette.secondary,
              color: palette.text
            }}
            onClick={() => setShowDelegationStrategy(true)}
          >
            <span suppressHydrationWarning className="text-xs">
              <TbSettingsAutomation className='inline'/> {delegationStrategy ? delegationStrategy.name : 'Automatic'}
            </span>
          </button>}
          <button
            type="button"
            onClick={() => refresh()}
            className="p-2 h-7 space-x-1 flex items-center justify-center border rounded-lg	border-white/10 border-solid border-1 fill-current"
            style={{
              borderColor: palette.secondary,
              color: palette.text
            }}
            >
            <RefreshSVG />
          </button>
        </div>
        <WalletButton setIsWalletModalOpen={setIsWalletModalOpen} />
      </div>
    </div>
  );
};

export default Header;
