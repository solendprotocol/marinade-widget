import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import Form from '../../components/Form';
import FormPairSelector from '../../components/FormPairSelector';
import { useAccounts } from '../../contexts/accounts';
import { useTokenContext } from '../../contexts/TokenContextProvider';
import { WalletModal } from 'src/components/WalletComponents/components/WalletModal';
import { useSwapContext } from 'src/contexts/SwapContext';
import { useScreenState } from 'src/contexts/ScreenProvider';
import { useWalletPassThrough } from 'src/contexts/WalletPassthroughProvider';
import RouteSelectionScreen from './RouteSelectionScreen';
import UnknownTokenModal from '../UnknownTokenModal/UnknownTokenModal';
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

const InitialScreen = ({ setShowStakeModeSettings, 
  setIsWalletModalOpen, 
  isWalletModalOpen, 
  showStakeModeSettings,
  setShowDelegationStrategy,
  showDelegationStrategy
}: Props) => {
  const { wallet } = useWalletPassThrough();
  const { accounts } = useAccounts();
  const { tokenMap } = useTokenContext();
  const {
    form,
    setForm,
    setErrors,
    selectedSwapRoute,
    jupiter: { loading },
  } = useSwapContext();
  const { setScreen } = useScreenState();

  const walletPublicKey = useMemo(() => wallet?.adapter.publicKey?.toString(), [wallet?.adapter.publicKey]);

  const balance = useMemo(() => {
    return form.fromMint ? accounts[form.fromMint]?.balance || 0 : 0;
  }, [walletPublicKey, accounts, form.fromMint]);

  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    if (!form.fromValue || !form.fromMint || !form.toMint || !form.toValue || !selectedSwapRoute || loading) {
      setErrors({});
      setIsDisabled(true);
      return;
    }

    if (Number(form.fromValue) > balance) {
      setErrors({
        fromValue: { title: 'Insufficient balance', message: '' },
      });
      setIsDisabled(true);
      return;
    }

    setErrors({});
    setIsDisabled(false);
  }, [form, balance]);

  const [selectPairSelector, setSelectPairSelector] = useState<'fromMint' | 'toMint' | null>(null);
  const [showRouteSelector, setShowRouteSelector] = useState<boolean>(false);
  const [showUnknownToken, setShowUnknownToken] = useState<TokenInfo | null>(null);

  const onSelectMint = useCallback(
    (tokenInfo: TokenInfo, approved: boolean = false) => {
      const isUnknown = tokenInfo.tags?.length === 0;
      if (isUnknown && approved === false) {
        setShowUnknownToken(tokenInfo);
        return;
      }

      if (selectPairSelector === 'fromMint') {
        setForm((prev) => ({
          ...prev,
          fromMint: tokenInfo.address,
          fromValue: '',

          // Prevent same token to same token;
          ...(prev.toMint === tokenInfo.address ? { toMint: prev.fromMint } : undefined),
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          toMint: tokenInfo.address,
          toValue: '',

          // Prevent same token to same token;
          ...(prev.fromMint === tokenInfo.address ? { fromMint: prev.toMint } : undefined),
        }));
      }
      setSelectPairSelector(null);
    },
    [selectPairSelector],
  );

  const availableMints: TokenInfo[] = useMemo(() => {
    let result = [...tokenMap.values()];
    return result;
  }, [tokenMap]);

  const onSubmitToConfirmation = useCallback(() => {
    setScreen('Confirmation');
  }, []);

  return (
    <>
      {/* Body */}
      <form onSubmit={onSubmitToConfirmation}>
        <Form
          onSubmit={onSubmitToConfirmation}
          isDisabled={isDisabled}
          setSelectPairSelector={setSelectPairSelector}
          setIsWalletModalOpen={setIsWalletModalOpen}
          setShowRouteSelector={setShowRouteSelector}
        />
      </form>

      {showDelegationStrategy ? (
        <div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <DelegationStrategy
            onSubmit={() => {}}
            tokenInfos={[...tokenMap.values()]}
            onClose={() => setShowDelegationStrategy(false)}
          />
        </div>
      ) : null}

      {showStakeModeSettings ? (
        <div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <StakeModeSettings
            onSubmit={() => {}}
            tokenInfos={[...tokenMap.values()]}
            onClose={() => setShowStakeModeSettings(false)}
          />
        </div>
      ) : null}

      {selectPairSelector !== null ? (
        <div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <FormPairSelector
            onSubmit={onSelectMint}
            tokenInfos={availableMints}
            onClose={() => setSelectPairSelector(null)}
          />
        </div>
      ) : null}

      {showRouteSelector ? (
        <div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <RouteSelectionScreen onClose={() => setShowRouteSelector(false)} />
        </div>
      ) : null}

      {isWalletModalOpen ? (
        <div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <WalletModal setIsWalletModalOpen={setIsWalletModalOpen} />
        </div>
      ) : null}

      {showUnknownToken ? (
        <div className="absolute h-full w-full flex justify-center items-center bg-black/50 rounded-lg overflow-hidden">
          <UnknownTokenModal
            tokensInfo={[showUnknownToken]}
            onClickAccept={() => {
              onSelectMint(showUnknownToken, true)
              setShowUnknownToken(null)
            }}
            onClickReject={() => setShowUnknownToken(null)}
          />
        </div>
      ) : null}
    </>
  );
};

export default InitialScreen;
