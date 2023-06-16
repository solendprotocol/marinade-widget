import { TokenInfo } from '@solana/spl-token-registry';
import React, { CSSProperties, useMemo } from 'react';
import CoinBalance from './Coinbalance';
import { PAIR_ROW_HEIGHT } from './FormPairSelector';
import TokenIcon from './TokenIcon';
import { StakeAccountType } from 'src/contexts/DataProvider';
import { formatAddress } from './ValidatorRow';
import { useUSDValueProvider } from 'src/contexts/USDValueProvider';
import Decimal from 'decimal.js';
import { NATIVE_MINT } from '@solana/spl-token';

const FormAccountRow: React.FC<{
  item: StakeAccountType;
  style: CSSProperties;
  onSubmit(item: StakeAccountType): void;
}> = ({ item, style, onSubmit }) => {
  const { tokenPriceMap } = useUSDValueProvider();
  const totalUsdValue = useMemo(() => {
    const tokenPrice = tokenPriceMap[NATIVE_MINT.toString()]?.usd;
    if (!tokenPrice) return null;

    const totalAValue = new Decimal(tokenPrice).mul(item.balance);
    return totalAValue;
  }, [item, tokenPriceMap]);

  return (
    <li
      className={`cursor-pointer list-none `}
      style={{ maxHeight: PAIR_ROW_HEIGHT, height: PAIR_ROW_HEIGHT, ...style, right: 0 }}
      translate="no"
    >
      <div
        className="flex items-center rounded-lg space-x-4 my-2 p-3 justify-between hover:bg-black/10"
        onClick={() => onSubmit(item)}
      >
        <div className="flex-shrink-0">
          <div className="h-6 w-6 rounded-full" style={{
            background: item.background
          }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className='flex flex-row space-x-2'>
            <p className="text-sm font-bold text-[#4A5568] truncate">
              {formatAddress(item.address)}
            </p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate flex space-x-1">
            Stake account: {formatAddress(item.address)}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className='flex flex-row space-x-2'>
            <p className="text-sm font-bold text-[#4A5568] truncate">
              {item.balance} SOL
            </p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate space-x-1">
          {totalUsdValue && totalUsdValue.gt(0.01) ? (
            <span className='ml-1'>
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
