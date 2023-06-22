import React, { CSSProperties } from 'react';
import { PAIR_ROW_HEIGHT } from './FormPairSelector';
import ValidatorIcon from './ValidatorIcon';
import { ValidatorType } from 'src/contexts/DataProvider';

export const formatAddress = (address: string, length?: number) => {
  return `${address.slice(0, length ?? 5)}...${address.slice(-(length ?? 5))}`;
};

const ValidatorRow: React.FC<{
  item: ValidatorType;
  style: CSSProperties;
  onSubmit(item: ValidatorType): void;
}> = ({ item, style, onSubmit }) => {
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
            <ValidatorIcon tokenInfo={item} width={24} height={24} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-row space-x-2">
            <p className="text-sm text-[#4A5568] truncate">{item.name}</p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate flex space-x-1">{formatAddress(item.address)}</div>
        </div>
      </div>
    </li>
  );
};

export default ValidatorRow;
