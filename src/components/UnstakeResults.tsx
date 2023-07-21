import React from 'react';
import { useTheme } from 'src/contexts/ThemeProvider';
import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';
import TokenIcon from './TokenIcon';
import { NumericFormat } from 'react-number-format';
import { IAccountsBalance } from 'src/contexts/accounts';
import { detectedSeparator } from 'src/misc/utils';
import CoinBalanceUSD from './CoinBalanceUSD';
import { useData } from 'src/contexts/DataProvider';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import JSBI from 'jsbi';

export function TokenBadge({ tokenInfo, color }: { tokenInfo?: TokenInfo; color: string }) {
  return (
    <div className="py-2 rounded-lg flex items-center pl-2">
      <div className="h-5 w-5">
        <TokenIcon tokenInfo={tokenInfo} width={20} height={20} />
      </div>
      <div className="mx-2 font-semibold" translate="no">
        <span
          style={{
            color,
          }}
        >
          {tokenInfo?.symbol ?? '-'}
        </span>
      </div>
    </div>
  );
}

const UnstakeResults: React.FC<{
  tokenInfo: TokenInfo;
  tokenAccount: IAccountsBalance;
  thousandSeparator: string;
}> = ({ tokenInfo, tokenAccount, thousandSeparator }) => {
  const { priceLoading, target, marinadeStats, stakeMode, instantUnstake, setInstantUnstake, bestRoute } = useData();
  const { palette } = useTheme();

  const depositFee = (target?.type === 'native' ? marinadeStats?.rewardDepositFee : marinadeStats?.rewardDepositStakeFee) ?? 0;
  const unstakeAmount = target?.amount && marinadeStats ? target.amount * marinadeStats.msolSolPrice : null;
  const stakeAmount = target?.amount && marinadeStats ? (target.amount / marinadeStats.msolSolPrice * (1-depositFee/100)) : null;
  const instantUnstakeAmount = JSBI.toNumber(bestRoute?.outAmount ?? JSBI.BigInt(0)) / 10 ** (tokenInfo?.decimals ?? 9);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="border border-transparent rounded-xl cursor-pointer"
        onClick={() => setInstantUnstake(true)}
        style={{
          color: palette.text,
          background: palette.secondaryBg,
          borderColor: instantUnstake && stakeMode === 'unstake' ? palette.primary : palette.secondary,
        }}
      >
        <div className="px-x border-transparent rounded-xl">
          <div className={classNames('p-4 flex flex-col')}>
            {stakeMode === 'unstake' && (
              <div className="flex justify-between items-center h-4">
                <span
                  className="text-xs pl-2 font-medium flex items-center gap-1"
                  style={{
                    color: palette.disabledText,
                  }}
                >
                  <AiOutlineClockCircle className="inline" />
                  NOW
                </span>
                {instantUnstake ? (
                  <span
                    style={{
                      color: palette.primary,
                    }}
                  >
                    <FaCheckCircle />
                  </span>
                ) : (
                  <span
                    className="mb-4 rounded-full overflow-hidden"
                    style={{
                      color: palette.secondary,
                    }}
                  >
                    <FaRegCircle
                      style={{
                        background: palette.primaryBg,
                      }}
                    />
                  </span>
                )}
              </div>
            )}
            <div className="flex justify-between items-center">
              <TokenBadge tokenInfo={tokenInfo!} color={palette.text} />

              {stakeAmount && unstakeAmount && !priceLoading ? (
                <div className="text-right">
                  <NumericFormat
                    disabled={true}
                    value={(stakeMode === 'unstake' ? instantUnstakeAmount : stakeAmount).toString()}
                    decimalScale={tokenAccount?.decimals ?? 9}
                    thousandSeparator={thousandSeparator}
                    allowNegative={false}
                    valueIsNumericString
                    className={classNames('h-full w-full bg-transparent text-right font-semibold text-lg')}
                    style={{
                      color: target?.amount ? palette.text : palette.disabledText,
                    }}
                    decimalSeparator={detectedSeparator}
                  />
                </div>
              ) : (
                <div className="h-4 w-32 animate-pulse bg-slate-200 rounded" />
              )}
            </div>
            {stakeAmount && !priceLoading ? (
              <div className="flex justify-end items-center">
                <span className="text-xs" style={{ color: palette.text }}>
                  {' '}
                  <CoinBalanceUSD
                    tokenInfo={tokenInfo}
                    amount={(stakeMode === 'unstake' ? instantUnstakeAmount : stakeAmount).toString()}
                  />
                </span>
              </div>
            ) : (
              <div className="flex justify-end items-center">
                <div className="h-4 w-16 animate-pulse bg-slate-200 rounded" />
              </div>
            )}
          </div>
        </div>
      </div>
      {stakeMode === 'unstake' && (
        <div
          className="border border-transparent rounded-xl cursor-pointer"
          onClick={() => setInstantUnstake(false)}
          style={{
            color: palette.text,
            background: palette.secondaryBg,
            borderColor: instantUnstake && stakeMode === 'unstake' ? palette.secondary : palette.primary,
          }}
        >
          <div className="px-x border-transparent rounded-xl">
            <div className={classNames('p-4 flex flex-col')}>
              {stakeMode === 'unstake' && (
                <div className="flex justify-between items-center h-4">
                  <span
                    className="text-xs pl-2 font-medium flex items-center gap-1"
                    style={{
                      color: palette.disabledText,
                    }}
                  >
                    <AiOutlineClockCircle className="inline" />
                    IN ~{marinadeStats?.timeTillNextEpoch}
                  </span>
                  {!instantUnstake ? (
                    <span
                      style={{
                        color: palette.primary,
                      }}
                    >
                      <FaCheckCircle />
                    </span>
                  ) : (
                    <span
                      className="mb-4 rounded-full overflow-hidden"
                      style={{
                        color: palette.secondary,
                      }}
                    >
                      <FaRegCircle
                        style={{
                          background: palette.primaryBg,
                        }}
                      />
                    </span>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center">
                <TokenBadge tokenInfo={tokenInfo!} color={palette.text} />

                {unstakeAmount && stakeAmount ? (
                  <div className="text-right">
                    <NumericFormat
                      disabled={true}
                      value={(stakeMode === 'unstake' ? unstakeAmount : stakeAmount).toString()}
                      decimalScale={tokenAccount?.decimals ?? 9}
                      thousandSeparator={thousandSeparator}
                      allowNegative={false}
                      valueIsNumericString
                      className={classNames('h-full w-full bg-transparent text-right font-semibold text-lg')}
                      style={{
                        color: target?.amount ? palette.text : palette.disabledText,
                      }}
                      decimalSeparator={detectedSeparator}
                    />
                  </div>
                ) : <div className="h-4 w-32 animate-pulse bg-slate-200 rounded" />}
              </div>
              {stakeAmount && unstakeAmount ? (
                <div className="flex justify-end items-center">
                  <span className="text-xs" style={{ color: palette.text }}>
                    {' '}
                    <CoinBalanceUSD
                      tokenInfo={tokenInfo}
                      amount={(stakeMode === 'unstake' ? unstakeAmount : stakeAmount).toString()}
                    />
                  </span>
                </div>
              ) : (
                <div className="flex justify-end items-center">
                  <div className="h-4 w-16 animate-pulse bg-slate-200 rounded" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnstakeResults;
