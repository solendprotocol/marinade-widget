import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';
import React, { createRef, memo, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeList, ListChildComponentProps } from 'react-window';
import LeftArrowIcon from 'src/icons/LeftArrowIcon';
import SearchIcon from 'src/icons/SearchIcon';
import { PAIR_SELECTOR_TOP_TOKENS } from 'src/misc/constants';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa'

import { useAccounts } from '../contexts/accounts';

import FormPairRow from './FormPairRow';
import { useUSDValueProvider } from 'src/contexts/USDValueProvider';
import Decimal from 'decimal.js';
import { useData } from 'src/contexts/DataProvider';

export const PAIR_ROW_HEIGHT = 72;
const SEARCH_BOX_HEIGHT = 56;

// eslint-disable-next-line react/display-name
const rowRenderer = memo((props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const item = data.searchResult[index];

  return <FormPairRow key={item.address} item={item} style={style} onSubmit={data.onSubmit} />;
}, areEqual);

const ModeRadio = ({selected, children}: {
  selected: Boolean,
  children: React.ReactNode
}) => {
  return <div className={selected ? "w-full justify-between p-4 border rounded-lg border-[#98D7C3] bg-[#ECFAF5]" : "w-full justify-between p-4 border rounded-lg border-[#EDF2F7] bg-[#F7FAFC]"}>
  <div className="flex w-full justify-between">
    <span className='text-xs text-[#4A5568] font-semibold mb-1'>Liquid staking</span>
    <span  className='mb-4 text-[#308D8A]'><FaCheckCircle/></span>
    </div>
    <span className='text-xs text-gray-500'>Stake your SOL without locking them up and earn staking rewards while staying completely liquid. Use mSOL (staked SOL) in DeFi.</span>
  </div>
}

const StakeModeSettings = ({
  onSubmit,
  tokenInfos,
  onClose,
}: {
  onSubmit: (value: TokenInfo) => void;
  onClose: () => void;
  tokenInfos: TokenInfo[];
}) => {
  const { stakeMode, setStakeMode } = useData();
  const inputRef = createRef<HTMLInputElement>();
  useEffect(() => inputRef.current?.focus(), [inputRef]);

  return (
    <div className="flex flex-col h-full w-full p-4 gap-4">
    <div className="flex w-full justify-between">
      <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={onClose}>
        <LeftArrowIcon width={24} height={24} />
      </div>

      <div className="text-[#4A5568] font-bold">Stake mode settings</div>

      <div className=" w-6 h-6" />
    </div>
      <div className="w-full justify-between p-4 border rounded-lg border-[#98D7C3] bg-[#ECFAF5]">
      <div className="flex w-full justify-between">
        <span className='text-xs text-[#4A5568] font-semibold mb-1'>Liquid staking</span>
        <span  className='mb-4 text-[#308D8A]'><FaCheckCircle/></span>
        </div>
        <span className='text-xs text-gray-500'>Stake your SOL without locking them up and earn staking rewards while staying completely liquid. Use mSOL (staked SOL) in DeFi.</span>
      </div>
      <div className="w-full justify-between p-4 border rounded-lg border-[#EDF2F7] bg-[#F7FAFC]">
      <div className="flex w-full justify-between">
        
      <span className='text-xs text-[#4A5568] font-semibold mb-1'>Native staking</span>
        <span  className='mb-4 text-[#E2E8F0]'><FaRegCircle /></span>
        </div>
        <span className='text-xs text-gray-500'>Lock up your tokens in Solana’s native staking contract to earn staking rewards. No smart contract risk.</span>
        </div>
    </div>
  );
};

export default StakeModeSettings;
