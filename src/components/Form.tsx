import { useCallback, useEffect, useMemo, useState } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

import { useAccounts } from '../contexts/accounts';

import { MAX_INPUT_LIMIT, MINIMUM_SOL_BALANCE, MSOL_MINT } from '../misc/constants';

import CoinBalance from './Coinbalance';
import FormError from './FormError';
import JupButton from './JupButton';

import TokenIcon from './TokenIcon';

import { WRAPPED_SOL_MINT } from '../constants';
import { useSwapContext } from 'src/contexts/SwapContext';
import useTimeDiff from './useTimeDiff/useTimeDiff';
import { useWalletPassThrough } from 'src/contexts/WalletPassthroughProvider';
import WalletIcon from 'src/icons/WalletIcon';
import ChevronDownIcon from 'src/icons/ChevronDownIcon';
import PriceInfo from './PriceInfo/index';
import { FaWallet } from 'react-icons/fa'
import SexyChameleonText from './SexyChameleonText/SexyChameleonText';
import { SwapMode } from '@jup-ag/react-hook';
import classNames from 'classnames';
import { detectedSeparator } from 'src/misc/utils';
import CoinBalanceUSD from './CoinBalanceUSD';
import Marinade from 'src/icons/Marinade';
import { useTokenContext } from 'src/contexts/TokenContextProvider';
import { useData } from 'src/contexts/DataProvider';
import { NATIVE_MINT } from '@solana/spl-token';
import { formatAddress } from './ValidatorRow';
import ChevronUpIcon from 'src/icons/ChevronUpIcon';

const Form: React.FC<{
  onSubmit: () => void;
  isDisabled: boolean;
  setSelectPairSelector: React.Dispatch<React.SetStateAction<'fromMint' | 'toMint' | null>>;
  setIsWalletModalOpen(toggle: boolean): void;
  setShowRouteSelector(toggle: boolean): void;
}> = ({ onSubmit, isDisabled, setSelectPairSelector, setIsWalletModalOpen, setShowRouteSelector }) => {
  const { connect, wallet } = useWalletPassThrough();
  const { accounts } = useAccounts();
  const [showTransactionInfo, setShowTransactionInfo] = useState<boolean>(false);
  const { target, setTargetAmount, marinadeStats, deposit } = useData();
  const { tokenMap } = useTokenContext();
  const {
    form,
    setForm,
    errors,
    fromTokenInfo,
    toTokenInfo,
    selectedSwapRoute,
    formProps: {
      swapMode,
      fixedAmount,
      fixedInputMint,
      fixedOutputMint,
    },
    jupiter: { routes, loading, refresh },
  } = useSwapContext();
  const [hasExpired, timeDiff] = useTimeDiff();
  useEffect(() => {
    if (hasExpired) {
      refresh();
    }
  }, [hasExpired]);

  const onConnectWallet = () => {
    if (wallet) connect();
    else {
      setIsWalletModalOpen(true);
    }
  };

  const walletPublicKey = useMemo(() => wallet?.adapter.publicKey?.toString(), [wallet?.adapter.publicKey]);

  const onChangeToValue = (value: string) => {
    if (value === '') {
      setForm((form) => ({ ...form, fromValue: '', toValue: '' }));
      return;
    }

    const isInvalid = Number.isNaN(value);
    if (isInvalid) return;

    setForm((form) => ({ ...form, toValue: value }));
  };

  const balance = useMemo(() => {
    return fromTokenInfo ? accounts[fromTokenInfo.address]?.balance || 0 : 0;
  }, [accounts, fromTokenInfo]);

  const onClickMax = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      if (!balance || swapMode === 'ExactOut') return;

      if (fromTokenInfo?.address === WRAPPED_SOL_MINT.toBase58()) {
        setForm((prev) => ({
          ...prev,
          fromValue: String(balance > MINIMUM_SOL_BALANCE ? (balance - MINIMUM_SOL_BALANCE).toFixed(6) : 0),
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          fromValue: String(balance),
        }));
      }
    },
    [balance, fromTokenInfo],
  );

  const msolTokenInfo = tokenMap.get(MSOL_MINT.toBase58());
  const solTokenInfo = tokenMap.get(NATIVE_MINT.toBase58());

  const { inputAmountDisabled } = useMemo(() => {
    const result = { inputAmountDisabled: true, outputAmountDisabled: true };
    if (!fixedAmount) {
      if (swapMode === SwapMode.ExactOut) {
        result.outputAmountDisabled = false;
      } else {
        result.inputAmountDisabled = false;
      }
    }
    return result;
  }, [fixedAmount, swapMode]);

  const marketRoutes = selectedSwapRoute ? selectedSwapRoute.marketInfos.map(({ label }) => label).join(', ') : '';

  const onClickSelectFromMint = useCallback(() => {
    if (fixedInputMint) return;
    setSelectPairSelector('fromMint')
  }, [fixedInputMint])

  const onClickSelectToMint = useCallback(() => {
    if (fixedOutputMint) return;
    setSelectPairSelector('toMint')
  }, [fixedOutputMint])

  const fixedOutputFomMintClass = useMemo(() => {
    if (swapMode === 'ExactOut' && !form.toValue) return 'opacity-20 hover:opacity-100';
    return '';
  }, [fixedOutputMint, form.toValue])


  const thousandSeparator = useMemo(() => detectedSeparator === ',' ? '.' : ',', []);
  // Allow empty input, and input lower than max limit
  const withValueLimit = useCallback(
    ({ floatValue }: NumberFormatValues) =>
      !floatValue || floatValue <= MAX_INPUT_LIMIT,
    []);
    
    const solAccount = accounts[NATIVE_MINT.toString()];
    const mSolAccount = accounts[MSOL_MINT.toString()];

  return (
    <div className="h-full flex flex-col items-center justify-center pb-1">
      <div className="w-full mt-2 rounded-xl flex flex-col px-2">
        <div className="flex-col">
        <div className="flex justify-between items-center">
        <span className='text-xs text-[#4A5568] font-semibold mb-1'>
          You&apos;re staking
          </span>
            {target?.type === 'native' && <span className='text-xs text-[#4A5568] text-thin'>
              <FaWallet className='inline text-[#CBD5E0]' /> {solAccount?.balance ?? 0} SOL{" "}
              <button type="button" className='font-light text-[#308D8A]' onClick={() => setTargetAmount(solAccount ? solAccount.balance / 2 : 0)}>
                HALF
                </button>
                {" "}
                <button type="button" className='font-light text-[#308D8A]' onClick={() => setTargetAmount(solAccount?.balance ?? 0)}>
                MAX
                </button>
            </span>}
          </div>
          <div className={classNames("border-b border-transparent bg-[#F7FAFC] rounded-xl transition-all", fixedOutputFomMintClass)}>
            <div className={classNames("px-x border-transparent rounded-xl ")}>
              <div>
                <div className={classNames("p-4 flex flex-col dark:text-[#4A5568]")}>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      className={`py-2 px-2 rounded-lg flex items-center ${target ? '' : 'bg-[#308D8A]'} hover:bg-[#308D8A]/${target ? '25' : '75'} text-[#4A5568]`}
                      disabled={fixedInputMint}
                      onClick={onClickSelectFromMint}
                    > 

                      {target && <div className="h-5 w-5">
                        {(target?.type === 'native' ? <TokenIcon tokenInfo={solTokenInfo} width={20} height={20} /> : null) ?? (target?.type === 'stakeAccount' ? <div className="h-5 w-5 rounded-full" style={{
            background: target.stakeAccount.background
          }} /> : null)}
                      </div>}
                      <div className="ml-2 font-semibold" translate="no">
                        {target && <span className="text-[#4A5568]">{' '}SOL</span>}
                        {!target && <span className={`${target ? 'text-[#4A5568]' : 'text-white'} fill-current mx-2`}>Select</span>}
                      </div>

                      <span className={`${target ? 'text-[#4A5568]' : 'text-white'} fill-current mx-2`}>
                          <ChevronDownIcon />
                        </span>
                    </button>

                    <div className="text-right">
                      <NumericFormat
                        disabled={!(target?.type === 'native')}
                        value={target?.amount}
                        decimalScale={fromTokenInfo?.decimals}
                        thousandSeparator={thousandSeparator}
                        allowNegative={false}
                        valueIsNumericString
                        onValueChange={({ value }) => setTargetAmount(Number(value))}
                        placeholder={'0.00'}
                        className={classNames("h-full w-full bg-transparent text-[#4A5568] text-right font-semibold dark:placeholder:text-[#4A5568]/25 text-lg", { 'cursor-not-allowed': inputAmountDisabled })}
                        decimalSeparator={detectedSeparator}
                        isAllowed={withValueLimit}
                      />
                      {solTokenInfo?.address ? (
                        <div className='flex justify-end items-center'>
                          {target ? (
                            <span className='text-xs text-[#4A5568]'>
                              {' '}<CoinBalanceUSD tokenInfo={solTokenInfo} amount={target.amount.toString()} />
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <span className='text-xs text-[#4A5568] mb-[-12px] mt-[-4px]'>
          {target?.type === 'stakeAccount' ? `Stake account: ${formatAddress(target.stakeAccount.address)}` : <div className='h-4' />}
          </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 mb-1">
            <span className='text-xs text-[#4A5568] font-semibold'>
            To receive
            </span>
            <span className='text-xs text-[#4A5568]'>
            <FaWallet className='inline text-[#CBD5E0]' /> {mSolAccount?.balance ?? 0} mSOL{" "}
            </span>
          </div>
          <div className="border-b border-transparent bg-[#F7FAFC] rounded-xl">
            <div className="px-x border-transparent rounded-xl">
              <div>
                <div className={classNames("p-4 flex flex-col dark:text-[#4A5568]")}>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      className="py-2 px-2 rounded-lg flex items-center text-[#4A5568]"
                      disabled={true}
                      onClick={onClickSelectToMint}
                    >
                      <div className="h-5 w-5"><TokenIcon tokenInfo={msolTokenInfo} width={20} height={20} /></div>
                      <div className="mx-2 font-semibold" translate="no">
                        <span className="text-[#4A5568]">mSOL</span>
                      </div>
                    </button>

                    {(msolTokenInfo && marinadeStats && target) ? (<div className="text-right">
                      <NumericFormat
                        disabled={!swapMode || swapMode === 'ExactIn'}
                        value={((target?.amount ?? 0) / marinadeStats.msolSolPrice).toString()}
                        decimalScale={mSolAccount.decimals}
                        thousandSeparator={thousandSeparator}
                        allowNegative={false}
                        valueIsNumericString
                        onValueChange={({ value }) => onChangeToValue(value)}
                        placeholder={swapMode === 'ExactOut' ? 'Enter desired amount' : ''}
                        className={classNames("h-full w-full bg-transparent text-[#4A5568] text-right font-semibold dark:placeholder:text-[#4A5568]/25 placeholder:text-sm placeholder:font-normal text-lg")}
                        decimalSeparator={detectedSeparator}
                        isAllowed={withValueLimit}
                      />
                      <div className='flex justify-end items-center'>
                        <span className='text-xs text-[#4A5568]'>
                          {' '}<CoinBalanceUSD tokenInfo={msolTokenInfo} amount={(target.amount / marinadeStats.msolSolPrice).toString()} />
                        </span>
                        </div>
                    </div>
                      ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {walletPublicKey ? <FormError errors={errors} /> : null}
      </div>

<div className="flex justify-between w-full p-2">
<span className='font-normal text-xs text-[#4A5568]'>
  Deposit fee: {((target?.type === 'native' ? marinadeStats?.rewardDepositFee : marinadeStats?.rewardDepositStakeFee) ?? 0) / 100}%
</span>
<span className='font-normal text-xs text-[#4A5568] '>
  
</span>
</div>
      <div className="w-full px-2">
        {!walletPublicKey ? (
          <JupButton size="lg" className="w-full" type="button" onClick={onConnectWallet}>
            Connect Wallet
          </JupButton>
        ) : (
          <JupButton
            size="md"
            className="w-full disabled:opacity-50 bg-[#308D8A]"
            type="button"
            onClick={deposit}
            disabled={!target || !target.amount}
          >
            {loading ? <span className="text-sm">Loading...</span> : <SexyChameleonText>Stake</SexyChameleonText>}
          </JupButton>
        )}
      </div>
      <div className='flex flex-col gap-1 w-full'>
      {target && marinadeStats && <div className="flex justify-between w-full px-2 mt-2">
      <span className='font-normal text-xs text-[#4A5568]'>
        1 mSOL ≈ {marinadeStats.msolSolPrice.toFixed(6)} SOL
      </span>
      <span className='flex items-center gap-1 font-normal text-xs text-[#4A5568] cursor-pointer' onClick={() => setShowTransactionInfo(!showTransactionInfo)}>
      {showTransactionInfo ? <><ChevronDownIcon/> Hide</> : <><ChevronUpIcon/> Show</>} transaction info
      </span>
      </div>}
      {target && marinadeStats && <div className="flex justify-between w-full px-2">
      <span className='font-normal text-xs text-[#4A5568]'>
        Staking reward fee
      </span>
      <span className='font-normal text-xs text-[#4A5568] '>
        {marinadeStats.stakingRewardFee}%
      </span>
      </div>}
      </div>

      <div className='flex justify-between items-center mt-6'>
        <Marinade />
      </div>
    </div>
  );
};

export default Form;
