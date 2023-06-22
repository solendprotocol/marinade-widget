import React from 'react';
import RefreshSVG from 'src/icons/RefreshSVG';
import { TbSettingsAutomation } from 'react-icons/tb';

import { WalletButton } from './WalletComponents';
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
