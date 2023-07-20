import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';
import React, { createRef, memo, useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeList, ListChildComponentProps } from 'react-window';
import LeftArrowIcon from 'src/icons/LeftArrowIcon';
import SearchIcon from 'src/icons/SearchIcon';

import { useAccounts } from '../contexts/accounts';

import ValidatorRow from './ValidatorRow';
import { ValidatorType, useData } from 'src/contexts/DataProvider';
import { useTheme } from 'src/contexts/ThemeProvider';

export const PAIR_ROW_HEIGHT = 72;
const SEARCH_BOX_HEIGHT = 36;

// eslint-disable-next-line react/display-name
const rowRenderer = memo((props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const item = data.searchResult[index];

  return <ValidatorRow key={item.address} item={item} style={style} onSubmit={data.onSubmit} />;
}, areEqual);

const ValidatorSelector = ({
  onSubmit,
  tokenInfos,
  onClose,
}: {
  onSubmit: (value: ValidatorType) => void;
  onClose: () => void;
  tokenInfos: TokenInfo[];
}) => {
  const { accounts } = useAccounts();
  const { validators } = useData();
  const { palette } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<ValidatorType[]>(validators);
  useEffect(() => {
    const sortedList = validators.sort((a, b) => (a.score > b.score ? -1 : 1));

    if (searchTerm) {
      const filteredList = sortedList.filter(
        (item) =>
          item.address.includes(searchTerm) ||
          item.identity.includes(searchTerm) ||
          item.name?.toLowerCase()?.includes(searchTerm.toLowerCase()),
      );
      setSearchResult(filteredList);
    } else {
      setSearchResult(sortedList);
    }
  }, [accounts, tokenInfos, searchTerm]);

  const listRef = createRef<FixedSizeList>();
  const inputRef = createRef<HTMLInputElement>();
  useEffect(() => inputRef.current?.focus(), [inputRef]);

  return (
    <div
      className="flex flex-col h-full w-full p-4"
      style={{
        background: palette.primaryBg,
      }}
    >
      <div className="flex w-full justify-between">
        <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={onClose}>
          <LeftArrowIcon width={24} height={24} />
        </div>

        <div className="text-[#4A5568] font-bold">Select a validator to direct stake</div>

        <div className=" w-6 h-6" />
      </div>

      <div
        className="flex px-5 mt-4 w-[98%] rounded-lg border border-[#EDF2F7] border hover:border-[#EDF2F7]/90"
        style={{ height: SEARCH_BOX_HEIGHT, maxHeight: SEARCH_BOX_HEIGHT }}
      >
        <input
          autoComplete="off"
          className="w-full rounded-xl mr-4 truncate text-xs"
          placeholder={`Search by name/pubkey/vote address...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          ref={inputRef}
        />
        <SearchIcon />
      </div>

      <div className="mt-2" style={{ flexGrow: 1 }}>
        {searchResult.length > 0 && (
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => {
              return (
                <FixedSizeList
                  ref={listRef}
                  height={height}
                  itemCount={searchResult.length}
                  itemSize={PAIR_ROW_HEIGHT}
                  width={width - 2} // -2 for scrollbar
                  itemData={{
                    searchResult,
                    onSubmit,
                  }}
                  className={classNames('overflow-y-scroll mr-1 min-h-[12rem] px-5 webkit-scrollbar')}
                >
                  {rowRenderer}
                </FixedSizeList>
              );
            }}
          </AutoSizer>
        )}

        {searchResult.length === 0 ? (
          <div className="mt-4 mb-4 text-center text-white/50">
            <span>No tokens found</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ValidatorSelector;
