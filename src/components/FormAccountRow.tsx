import React, { CSSProperties, useMemo } from 'react';
import { PAIR_ROW_HEIGHT } from './FormPairSelector';
import { StakeAccountType } from 'src/contexts/DataProvider';
import { useTheme } from 'src/contexts/ThemeProvider';
import { formatAddress } from './ValidatorRow';
import { useUSDValueProvider } from 'src/contexts/USDValueProvider';
import Decimal from 'decimal.js';
import { NATIVE_MINT } from '@solana/spl-token';

const FormAccountRow: React.FC<{
  item: StakeAccountType;
  style: CSSProperties;
  onSubmit(item: StakeAccountType): void;
  disabled?: boolean;
}> = ({ item, style, onSubmit, disabled }) => {
  const { palette } = useTheme();
  const { tokenPriceMap } = useUSDValueProvider();
  const totalUsdValue = useMemo(() => {
    const tokenPrice = tokenPriceMap[NATIVE_MINT.toString()]?.usd;
    if (!tokenPrice) return null;

    const totalAValue = new Decimal(tokenPrice).mul(item.balance);
    return totalAValue;
  }, [item, tokenPriceMap]);

  return (
    <li
      className={`${disabled ? '' : 'cursor-pointer'} list-none `}
      style={{ maxHeight: PAIR_ROW_HEIGHT, height: PAIR_ROW_HEIGHT, ...style, right: 0 }}
      translate="no"
    >
      <div
        className="flex items-center rounded-lg space-x-4 my-2 p-3 justify-between hover:bg-black/10"
        onClick={disabled ? undefined : () => onSubmit(item)}
      >
        <div className="flex-shrink-0">
          <div
            className="h-6 w-6 rounded-full"
            style={{
              background: item.background,
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-row space-x-2">
            <p
              className="text-sm font-bold truncate"
              style={{
                color: palette.text,
              }}
            >
              {formatAddress(item.address)}
            </p>
          </div>
          <div
            className="mt-1 text-xs truncate flex space-x-1"
            style={{
              color: palette.text,
            }}
          >
            {item.status === 'active' && `Stake account: ${formatAddress(item.address)}`}
            {item.status === 'inactive' && (
              <span
                className="text-xs mb-1"
                style={{
                  color: palette.disabledText,
                }}
              >
                Inactive... Wait {item.waitEpoch} epoch{item.waitEpoch === 1 ? '' : 's'}
              </span>
            )}
            {item.status === 'minBalance' && (
              <span
                className="text-xs mb-1"
                style={{
                  color: palette.disabledText,
                }}
              >
                Amount must be &gt; 1 SOL
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="flex flex-row space-x-2">
            <p
              className="text-sm font-bold truncate"
              style={{
                color: palette.text,
              }}
            >
              {item.balance} SOL
            </p>
          </div>

          <div className="mt-1 text-xs truncate space-x-1">
            {totalUsdValue && totalUsdValue.gt(0.01) ? (
              <span
                className="ml-1"
                style={{
                  color: palette.disabledText,
                }}
              >
                ${totalUsdValue.toFixed(2)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
};

export default FormAccountRow;
