import { useCallback, useMemo, useState } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format';
import { useAccounts } from '../contexts/accounts';
import { MAX_INPUT_LIMIT, MSOL_MINT } from '../misc/constants';
import ActionButton from './ActionButton';
import TokenIcon from './TokenIcon';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { useWalletPassThrough } from 'src/contexts/WalletPassthroughProvider';
import ChevronDownIcon from 'src/icons/ChevronDownIcon';
import { FaWallet } from 'react-icons/fa';
import BigText from './BigText/BigText';
import classNames from 'classnames';
import { detectedSeparator } from 'src/misc/utils';
import CoinBalanceUSD from './CoinBalanceUSD';
import Marinade from 'src/icons/MarinadeLogo';
import { useTokenContext } from 'src/contexts/TokenContextProvider';
import { useData } from 'src/contexts/DataProvider';
import { useTheme } from 'src/contexts/ThemeProvider';
import { NATIVE_MINT } from '@solana/spl-token';
import { formatAddress } from './ValidatorRow';
import ChevronUpIcon from 'src/icons/ChevronUpIcon';
import Tooltip from './Tooltip';

const Form: React.FC<{
  setSelectPairSelector: React.Dispatch<React.SetStateAction<'fromMint' | 'toMint' | null>>;
  setIsWalletModalOpen(toggle: boolean): void;
}> = ({ setSelectPairSelector, setIsWalletModalOpen }) => {
  const { connect, wallet } = useWalletPassThrough();
  const { accounts } = useAccounts();
  const [showTransactionInfo, setShowTransactionInfo] = useState<boolean>(false);
  const { target, setTargetAmount, marinadeStats, deposit, delegationStrategy, calcVotePower } = useData();
  const { palette, colors } = useTheme();
  const { tokenMap } = useTokenContext();

  const onConnectWallet = () => {
    if (wallet) connect();
    else {
      setIsWalletModalOpen(true);
    }
  };

  const walletPublicKey = useMemo(() => wallet?.adapter.publicKey?.toString(), [wallet?.adapter.publicKey]);

  const msolTokenInfo = tokenMap.get(MSOL_MINT.toBase58());
  const solTokenInfo = tokenMap.get(NATIVE_MINT.toBase58());

  const onClickSelectFromMint = useCallback(() => {
    setSelectPairSelector('fromMint');
  }, []);

  const thousandSeparator = useMemo(() => (detectedSeparator === ',' ? '.' : ','), []);
  // Allow empty input, and input lower than max limit
  const withValueLimit = useCallback(
    ({ floatValue }: NumberFormatValues) => !floatValue || floatValue <= MAX_INPUT_LIMIT,
    [],
  );

  const solAccount = accounts[NATIVE_MINT.toString()];
  const mSolAccount = accounts[MSOL_MINT.toString()];

  const stakeFromTransaction = target?.amount ? calcVotePower(target.amount) : 0;
  const stakeFromSnapshot = calcVotePower();

  return (
    <div className="h-full flex flex-col items-center justify-center pb-1">
      <div className="w-full mt-2 rounded-xl flex flex-col">
        <div className="flex-col">
          <div className="flex justify-between items-center">
            <span
              style={{
                color: colors.disabledTextDark,
              }}
              className={`text-xs font-semibold mb-1`}
            >
              You&apos;re staking
            </span>
            {target?.type === 'native' && (
              <span
                style={{
                  color: colors.disabledTextDark,
                }}
                className={`text-xs text-thin flex items-center gap-1`}
              >
                <FaWallet className="inline text-[#CBD5E0]" /> {solAccount?.balance ?? 0} SOL{' '}
                <button
                  style={{
                    color: palette.primary,
                  }}
                  type="button"
                  className="font-light"
                  onClick={() => setTargetAmount(solAccount ? solAccount.balance / 2 : 0)}
                >
                  HALF
                </button>{' '}
                <button
                  style={{
                    color: palette.primary,
                  }}
                  type="button"
                  className="font-light"
                  onClick={() => setTargetAmount(solAccount?.balance ?? 0)}
                >
                  MAX
                </button>
              </span>
            )}
          </div>
          <div
            style={{
              background: palette.secondaryBg,
            }}
            className={classNames(`border-b border-transparent rounded-xl transition-all`)}
          >
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
                      {target && (
                        <div className="h-5 w-5">
                          {(target?.type === 'native' ? (
                            <TokenIcon tokenInfo={solTokenInfo} width={20} height={20} />
                          ) : null) ??
                            (target?.type === 'stakeAccount' ? (
                              <div
                                className="h-5 w-5 rounded-full"
                                style={{
                                  background: target.stakeAccount.background,
                                }}
                              />
                            ) : null)}
                        </div>
                      )}
                      <div className="ml-2 font-semibold" translate="no">
                        {target && (
                          <span
                            style={{
                              color: palette.text,
                            }}
                          >
                            {' '}
                            SOL
                          </span>
                        )}
                        {!target && (
                          <span
                            className="fill-current mx-2"
                            style={{
                              color: palette.primaryBg,
                            }}
                          >
                            Select
                          </span>
                        )}
                      </div>

                      <span
                        style={{
                          color: palette.primaryBg,
                        }}
                        className="fill-current mx-2"
                      >
                        <ChevronDownIcon />
                      </span>
                    </button>

                    <div className="text-right">
                      <NumericFormat
                        disabled={!(target?.type === 'native')}
                        value={target?.amount ?? ''}
                        decimalScale={solTokenInfo?.decimals}
                        thousandSeparator={thousandSeparator}
                        allowNegative={false}
                        valueIsNumericString
                        onValueChange={({ value }) => setTargetAmount(value ? Number(value) : undefined)}
                        placeholder={'0.00'}
                        className={classNames('h-full w-full bg-transparent text-right font-semibold text-lg')}
                        style={{
                          color: target?.amount ? palette.text : palette.disabledText,
                        }}
                        decimalSeparator={detectedSeparator}
                        isAllowed={withValueLimit}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: palette.text }}>
                      {target?.type === 'stakeAccount' ? (
                        <>
                          <span className="font-semibold">Stake account</span>{' '}
                          {formatAddress(target.stakeAccount.address)}
                        </>
                      ) : (
                        <div className="h-4" />
                      )}
                    </span>
                    {solTokenInfo?.address ? (
                      <div className="flex justify-end items-center">
                        {target?.amount ? (
                          <span className="text-xs" style={{ color: palette.text }}>
                            {' '}
                            <CoinBalanceUSD tokenInfo={solTokenInfo} amount={target.amount.toString()} />
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 mb-1">
            <span className={`text-xs text-[${colors.disabledTextDark}] font-semibold`}>To receive</span>
            <span
              className={`text-xs text-thin flex items-center gap-1`}
              style={{
                color: colors.disabledTextDark,
              }}
            >
              <FaWallet className="inline text-[#CBD5E0]" /> {mSolAccount?.balance ?? 0} mSOL{' '}
            </span>
          </div>
          <div
            className="border-b border-transparent rounded-xl"
            style={{
              background: palette.secondaryBg,
            }}
          >
            <div className="px-x border-transparent rounded-xl">
              <div>
                <div className={classNames('p-4 flex flex-col')}>
                  <div className="flex justify-between items-center">
                    <button type="button" className="py-2 rounded-lg flex items-center" disabled={true}>
                      <div className="h-5 w-5">
                        <TokenIcon tokenInfo={msolTokenInfo} width={20} height={20} />
                      </div>
                      <div className="mx-2 font-semibold" translate="no">
                        <span
                          style={{
                            color: palette.text,
                          }}
                        >
                          mSOL
                        </span>
                      </div>
                    </button>

                    {marinadeStats && target ? (
                      <div className="text-right">
                        <NumericFormat
                          disabled={true}
                          value={((target?.amount ?? 0) / marinadeStats.msolSolPrice).toString()}
                          decimalScale={mSolAccount?.decimals ?? 9}
                          thousandSeparator={thousandSeparator}
                          allowNegative={false}
                          valueIsNumericString
                          className={classNames('h-full w-full bg-transparent text-right font-semibold text-lg')}
                          style={{
                            color: target?.amount ? palette.text : palette.disabledText,
                          }}
                          decimalSeparator={detectedSeparator}
                          isAllowed={withValueLimit}
                        />
                      </div>
                    ) : null}
                  </div>
                  {msolTokenInfo && marinadeStats && target?.amount ? (
                    <div className="flex justify-end items-center">
                      <span className="text-xs" style={{ color: palette.text }}>
                        {' '}
                        <CoinBalanceUSD
                          tokenInfo={msolTokenInfo}
                          amount={(target.amount / marinadeStats.msolSolPrice).toString()}
                        />
                      </span>
                    </div>
                  ) : (
                    <div className="h-4" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full p-2">
        <span className="font-normal text-xs" style={{ color: palette.text }}>
          Deposit fee:{' '}
          {((target?.type === 'native' ? marinadeStats?.rewardDepositFee : marinadeStats?.rewardDepositStakeFee) ?? 0) /
            100}
          %
        </span>
      </div>
      <div className="w-full">
        {!walletPublicKey ? (
          <ActionButton size="lg" className="w-full" type="button" onClick={onConnectWallet}>
            Connect Wallet
          </ActionButton>
        ) : (
          <ActionButton
            size="lg"
            className="w-full disabled:opacity-50"
            type="button"
            onClick={deposit}
            disabled={!target || !target.amount}
          >
            <BigText>Stake</BigText>
          </ActionButton>
        )}
      </div>
      <div className="flex flex-col gap-1 w-full">
        {target && marinadeStats && (
          <div className="flex justify-between w-full mt-2">
            <span className="font-normal text-xs" style={{ color: palette.text }}>
              1 mSOL ≈ {marinadeStats.msolSolPrice.toFixed(6)} SOL
            </span>
            <span
              className="flex items-center gap-1 font-normal text-xs cursor-pointer"
              style={{ color: palette.text }}
              onClick={() => setShowTransactionInfo(!showTransactionInfo)}
            >
              {showTransactionInfo ? (
                <>
                  <ChevronDownIcon /> Hide
                </>
              ) : (
                <>
                  <ChevronUpIcon /> Show
                </>
              )}{' '}
              transaction info
            </span>
          </div>
        )}
        {delegationStrategy && target?.amount && (
          <>
            <div className="flex justify-between w-full">
              <span
                className="font-normal text-xs flex gap-1 items-center"
                style={{
                  color: palette.text,
                }}
              >
                Directed stake{' '}
                <Tooltip
                  content={
                    <>
                      Estimated SOL amount that the validator will receive at the end of next epoch, based on your mSOL
                      holdings.
                      <br />
                      <br />
                      <a
                        href="https://docs.marinade.finance/marinade-products/directed-stake"
                        rel="noreferrer"
                        target={'_blank'}
                        className="cursor-pointer"
                      >
                        How directed stake works
                      </a>
                    </>
                  }
                >
                  <AiOutlineInfoCircle />
                </Tooltip>
              </span>
              <span
                className="font-normal text-xs"
                style={{
                  color: palette.text,
                }}
              >
                {(stakeFromTransaction + stakeFromSnapshot).toFixed(6)} SOL
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span
                className="font-normal text-xs flex gap-1 items-center ml-4"
                style={{
                  color: palette.text,
                }}
              >
                Current transaction
              </span>
              <span
                className="font-normal text-xs"
                style={{
                  color: palette.text,
                }}
              >
                {stakeFromTransaction.toFixed(6)} SOL
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span
                className="font-normal text-xs flex gap-1 items-center ml-4"
                style={{
                  color: palette.text,
                }}
              >
                Existing mSOL
              </span>
              <span
                className="font-normal text-xs"
                style={{
                  color: palette.text,
                }}
              >
                {stakeFromSnapshot.toFixed(6)} SOL
              </span>
            </div>
          </>
        )}
        {target && marinadeStats && (
          <div className="flex justify-between w-full">
            <span
              className="font-normal text-xs flex gap-1 items-center"
              style={{
                color: palette.text,
              }}
            >
              Staking reward fee{' '}
              <Tooltip content="The staking rewards fee is the fee that is charged on the rewards earned by staking your SOL. The base deposit is not charged.">
                <AiOutlineInfoCircle />
              </Tooltip>
            </span>
            <span
              className="font-normal text-xs"
              style={{
                color: palette.text,
              }}
            >
              {marinadeStats.stakingRewardFee}%
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Marinade />
      </div>
    </div>
  );
};

export default Form;
