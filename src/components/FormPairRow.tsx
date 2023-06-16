import { TokenInfo } from '@solana/spl-token-registry';
import React, { CSSProperties, useMemo } from 'react';

import CoinBalance from './Coinbalance';
import { PAIR_ROW_HEIGHT } from './FormPairSelector';
import TokenIcon from './TokenIcon';
import TokenLink from './TokenLink';
import { useUSDValueProvider } from 'src/contexts/USDValueProvider';
import Decimal from 'decimal.js';
import { useAccounts } from 'src/contexts/accounts';

const FormPairRow: React.FC<{
  item: TokenInfo;
  style: CSSProperties;
  onSubmit(item: TokenInfo): void;
}> = ({ item, style, onSubmit }) => {
  const { accounts } = useAccounts();
  const { tokenPriceMap } = useUSDValueProvider();

  const totalUsdValue = useMemo(() => {
    const totalAValue = new Decimal(1);
    return totalAValue;
  }, [accounts, tokenPriceMap])

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
          <div className="h-6 w-6 rounded-full">
            <TokenIcon tokenInfo={item} width={24} height={24} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className='flex flex-row space-x-2'>
            <p className="text-sm font-bold text-[#4A5568] truncate">
              {item.symbol}
            </p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate flex space-x-1">
            {item.name}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className='flex flex-row space-x-2'>
            <p className="text-sm font-bold text-[#4A5568] truncate">
              <CoinBalance mintAddress={item.address} />
            </p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate space-x-1">
            ${item.decimals}.00
          </div>
        </div>
      </div>
    </li>
  );
};

export default FormPairRow;
