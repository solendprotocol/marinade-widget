import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';
import React, { createRef, memo, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeList, ListChildComponentProps } from 'react-window';
import LeftArrowIcon from 'src/icons/LeftArrowIcon';
import SearchIcon from 'src/icons/SearchIcon';
import { PAIR_SELECTOR_TOP_TOKENS } from 'src/misc/constants';

import { useAccounts } from '../contexts/accounts';

import FormPairRow from './FormPairRow';
import { useUSDValueProvider } from 'src/contexts/USDValueProvider';
import Decimal from 'decimal.js';
import { useData } from 'src/contexts/DataProvider';
import FormAccountRow from './FormAccountRow';
import { useSwapContext } from 'src/contexts/SwapContext';

export const PAIR_ROW_HEIGHT = 72;
const SEARCH_BOX_HEIGHT = 56;

// eslint-disable-next-line react/display-name
const rowRenderer = memo((props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const item = data.searchResult[index];

  return <FormPairRow key={item.address} item={item} style={style} onSubmit={data.onSubmit} />;
}, areEqual);

const FormPairSelector = ({
  onSubmit,
  tokenInfos,
  onClose,
}: {
  onSubmit: (value: TokenInfo) => void;
  onClose: () => void;
  tokenInfos: TokenInfo[];
}) => {
  const { stakeAccounts, setTarget, palette } = useData();
  const inputRef = createRef<HTMLInputElement>();
  useEffect(() => inputRef.current?.focus(), [inputRef]);

  const solAccount = tokenInfos.find(r => r.symbol === 'SOL');

  return (
    <div className="flex flex-col h-full w-full p-4" style={{
      background: palette.primaryBg
    }}>
      <div className="flex w-full justify-between">
        <div className="fill-current w-6 h-6 cursor-pointer" style={{
              color: palette.text
            }} onClick={onClose}>
          <LeftArrowIcon width={24} height={24} />
        </div>

        <div className="font-bold" style={{
              color: palette.text
            }}>Select token or stake account</div>

        <div className=" w-6 h-6" />
      </div>
      <div className="mt-2 ![overflow:overlay]">
        {solAccount && <FormPairRow key='SOL' item={{
          ...solAccount,
          name: 'Solana'
          }} style={{}} onSubmit={() => {
            setTarget({
            type: 'native',
            amount: 0
          })
        
          onClose();}
          } />}
        <span className='pl-2 text-xs font-semibold mb-1' style={{
              color: palette.text
            }}>
          Stake accounts
        </span>
        {stakeAccounts.filter(s => s.status !== 'minBalance').map(r => 
          <FormAccountRow key={r.address} item={r} style={{}} onSubmit={() => {
            setTarget({
            type: 'stakeAccount',
            stakeAccount: r,
            amount: Number(r.balance)
          })
          onClose();}} /> )}
      </div>
      <span className='pl-2 text-xs mb-1' style={{
              color: palette.disabledText
            }}>
          Amount must be &gt; 1 SOL
        </span>
        {stakeAccounts.filter(s => s.status === 'minBalance').map(r => 
          <FormAccountRow key={r.address} item={r} style={{}} onSubmit={() => {
            setTarget({
            type: 'stakeAccount',
            stakeAccount: r,
            amount: Number(r.balance)
          })
          onClose();}} /> )}
    </div>
  );
};

export default FormPairSelector;
