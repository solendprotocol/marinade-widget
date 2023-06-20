import { useCallback, useEffect, useMemo, useState } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

import { useAccounts } from '../contexts/accounts';

import { MAX_INPUT_LIMIT, MINIMUM_SOL_BALANCE, MSOL_MINT } from '../misc/constants';
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
  const { target, setTargetAmount, marinadeStats, deposit, palette, colors } = useData();
  const { tokenMap } = useTokenContext();
  const {
    form,
    setForm,
    errors,
    fromTokenInfo,
    toTokenInfo,
    selectedSwapRoute,
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

  const msolTokenInfo = tokenMap.get(MSOL_MINT.toBase58());
  const solTokenInfo = tokenMap.get(NATIVE_MINT.toBase58());

  const onClickSelectFromMint = useCallback(() => {
    setSelectPairSelector('fromMint')
  }, [])


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
      <div className="w-full mt-2 rounded-xl flex flex-col">
        <div className="flex-col">
        <div className="flex justify-between items-center">
        <span 
        style={{
          color: colors.disabledTextDark
        }}
        className={`text-xs font-semibold mb-1`}>
          You&apos;re staking
          </span>
            {target?.type === 'native' && <span
            style={{
              color: colors.disabledTextDark
            }}
              className={`text-xs text-thin flex items-center gap-1`}
            >
              <FaWallet className='inline text-[#CBD5E0]' /> {solAccount?.balance ?? 0} SOL{" "}
              <button 
              style={{
                color: palette.primary
              }}
              type="button" className='font-light' onClick={() => setTargetAmount(solAccount ? solAccount.balance / 2 : 0)}>
                HALF
                </button>
                {" "}
                <button 
                style={{
                  color: palette.primary
                }}
                type="button" className='font-light' onClick={() => setTargetAmount(solAccount?.balance ?? 0)}>
                MAX
                </button>
            </span>}
          </div>
          <div 
          style={{
            background: palette.secondaryBg
          }}
            className={classNames(`border-b border-transparent rounded-xl transition-all`)}>
            <div className={`px-x border-transparent rounded-xl `}>
              <div>
                <div className={`p-4 flex flex-col`}>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      className={`py-2 rounded-lg flex items-center hover:opacity-75 disabled:opacity-50`}
                      style={{
                        background: target ? undefined : palette.primary,
                      }}
                      disabled={!wallet}
                      onClick={onClickSelectFromMint}
                    > 

                      {target && <div className="h-5 w-5">
                        {(target?.type === 'native' ? <TokenIcon 
                          tokenInfo={solTokenInfo} width={20} height={20} /> : null) ?? (target?.type === 'stakeAccount' ? <div className="h-5 w-5 rounded-full" 
                          style={{
                            background: target.stakeAccount.background
                          }} /> : null)}
                      </div>}
                      <div className="ml-2 font-semibold" translate="no">
                        {target && <span style={{
                            color: palette.text
                          }}>{' '}SOL</span>}
                        {!target && <span style={{
                          color: wallet ? palette.primaryBg : palette.disabledText
                        }} className='fill-current mx-2'>Select</span>}
                      </div>

                      <span style={{
                          color: wallet ? palette.primaryBg : palette.disabledText
                      }}className='fill-current mx-2'>
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
                        className={classNames("h-full w-full bg-transparent text-right font-semibold text-lg")}
                        style={{
                          color: target?.amount ? palette.text : palette.disabledText,
                        }}
                        decimalSeparator={detectedSeparator}
                        isAllowed={withValueLimit}
                      />
                    </div>
                  </div>
                  <div className='flex justify-between'>
                  <span className='text-xs' style={{ color: palette.text}}>
          {target?.type === 'stakeAccount' ? <><span className='font-semibold'>Stake account</span> {formatAddress(target.stakeAccount.address)}</> : <div className='h-4' />}
          </span>{solTokenInfo?.address ? (
                        <div className='flex justify-end items-center'>
                          {target ? (
                            <span className='text-xs' style={{ color: palette.text}}>
                              {' '}<CoinBalanceUSD tokenInfo={solTokenInfo} amount={target.amount.toString()} />
                            </span>
                          ) : null}
                        </div>
                      ) : null}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 mb-1">
            <span className={`text-xs text-[${colors.disabledTextDark}] font-semibold`}>
            To receive
            </span>
            <span className={`text-xs text-thin flex items-center gap-1`}
            style={{
              color: colors.disabledTextDark
            }}>
            <FaWallet className='inline text-[#CBD5E0]' /> {mSolAccount?.balance ?? 0} mSOL{" "}
            </span>
          </div>
          <div className="border-b border-transparent rounded-xl"
          style={{
            background: palette.secondaryBg
          }}>
            <div className="px-x border-transparent rounded-xl">
              <div>
                <div className={classNames("p-4 flex flex-col")}>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      className="py-2 rounded-lg flex items-center"
                      disabled={true}
                    >
                      <div className="h-5 w-5"><TokenIcon tokenInfo={msolTokenInfo} width={20} height={20} /></div>
                      <div className="mx-2 font-semibold" translate="no">
                        <span style={{
                          color: palette.text
                        }}>mSOL</span>
                      </div>
                    </button>

                    {(marinadeStats && target) ? (<div className="text-right">
                      <NumericFormat
                        disabled={true}
                        value={((target?.amount ?? 0) / marinadeStats.msolSolPrice).toString()}
                        decimalScale={mSolAccount?.decimals ?? 9}
                        thousandSeparator={thousandSeparator}
                        allowNegative={false}
                        valueIsNumericString
                        onValueChange={({ value }) => onChangeToValue(value)}
                        className={classNames("h-full w-full bg-transparent text-right font-semibold text-lg")}
                        style={{
                          color: target?.amount ? palette.text : palette.disabledText,
                        }}
                        decimalSeparator={detectedSeparator}
                        isAllowed={withValueLimit}
                      />
                    </div>
                      ) : null}
                  </div>
                  {(msolTokenInfo && marinadeStats && target?.amount) ? <div className='flex justify-end items-center'>
                        <span className='text-xs' style={{ color: palette.text}}>
                          {' '}<CoinBalanceUSD tokenInfo={msolTokenInfo} amount={(target.amount / marinadeStats.msolSolPrice).toString()} />
                        </span>
                        </div> : <div className='h-4' />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {walletPublicKey ? <FormError errors={errors} /> : null}
      </div>

<div className="flex justify-between w-full p-2">
<span className='font-normal text-xs' style={{ color: palette.text}}>
  Deposit fee: {((target?.type === 'native' ? marinadeStats?.rewardDepositFee : marinadeStats?.rewardDepositStakeFee) ?? 0) / 100}%
</span>
</div>
      <div className="w-full">
        {!walletPublicKey ? (
          <JupButton size="lg" className="w-full" type="button" onClick={onConnectWallet}>
            Connect Wallet
          </JupButton>
        ) : (
          <JupButton
            size="lg"
            className="w-full disabled:opacity-50"
            type="button"
            onClick={deposit}
            disabled={!target || !target.amount}
          >
            {loading ? <span className="text-sm">Loading...</span> : <SexyChameleonText>Stake</SexyChameleonText>}
          </JupButton>
        )}
      </div>
      <div className='flex flex-col gap-1 w-full'>
      {target && marinadeStats && <div className="flex justify-between w-full mt-2">
      <span className='font-normal text-xs' style={{ color: palette.text}}>
        1 mSOL ≈ {marinadeStats.msolSolPrice.toFixed(6)} SOL
      </span>
      <span className='flex items-center gap-1 font-normal text-xs cursor-pointer' style={{ color: palette.text}} onClick={() => setShowTransactionInfo(!showTransactionInfo)}>
      {showTransactionInfo ? <><ChevronDownIcon/> Hide</> : <><ChevronUpIcon/> Show</>} transaction info
      </span>
      </div>}
      {target && marinadeStats && <div className="flex justify-between w-full">
      <span className='font-normal text-xs' style={{
        color: palette.text
      }}>
        Staking reward fee
      </span>
      <span className='font-normal text-xs' style={{
        color: palette.text
      }}>
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
