import React, { useMemo, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import Form from '../../components/Form';
import FormPairSelector from '../../components/FormPairSelector';
import { useTokenContext } from '../../contexts/TokenContextProvider';
import { WalletModal } from 'src/components/WalletComponents/components/WalletModal';
import StakeModeSettings from '../StakeModeSettings';
import DelegationStrategy from '../DelegationStrategy';

interface Props {
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStakeModeSettings: React.Dispatch<React.SetStateAction<boolean>>;
  showStakeModeSettings: boolean;
  setShowDelegationStrategy: React.Dispatch<React.SetStateAction<boolean>>;
  showDelegationStrategy: boolean;
}

const InitialScreen = ({
  setShowStakeModeSettings,
  setIsWalletModalOpen,
  isWalletModalOpen,
  showStakeModeSettings,
  setShowDelegationStrategy,
  showDelegationStrategy,
}: Props) => {
  const { tokenMap } = useTokenContext();
  const [selectPairSelector, setSelectPairSelector] = useState<'fromMint' | 'toMint' | null>(null);
  const availableMints: TokenInfo[] = useMemo(() => {
    let result = [...tokenMap.values()];
    return result;
  }, [tokenMap]);

  return (
    <>
      {/* Body */}
      <Form setSelectPairSelector={setSelectPairSelector} setIsWalletModalOpen={setIsWalletModalOpen} />

      {showDelegationStrategy ? (
        <div className="absolute top-0 right-0 h-full w-full rounded-lg overflow-hidden">
          <DelegationStrategy tokenInfos={[...tokenMap.values()]} onClose={() => setShowDelegationStrategy(false)} />
        </div>
      ) : null}

      {showStakeModeSettings ? (
        <div className="absolute top-0 right-0 h-full w-full rounded-lg overflow-hidden">
          <StakeModeSettings onClose={() => setShowStakeModeSettings(false)} />
        </div>
      ) : null}

      {selectPairSelector !== null ? (
        <div className="absolute top-0 right-0 h-full w-full rounded-lg overflow-hidden">
          <FormPairSelector tokenInfos={availableMints} onClose={() => setSelectPairSelector(null)} />
        </div>
      ) : null}

      {isWalletModalOpen ? (
        <div className="absolute top-0 right-0 h-full w-full rounded-lg overflow-hidden">
          <WalletModal setIsWalletModalOpen={setIsWalletModalOpen} />
        </div>
      ) : null}
    </>
  );
};

export default InitialScreen;
