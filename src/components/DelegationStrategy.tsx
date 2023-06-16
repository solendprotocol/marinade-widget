import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';
import React, { ReactElement, createRef, memo, useEffect, useState } from 'react';
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
import ChevronDownIcon from 'src/icons/ChevronDownIcon';
import ValidatorSelector from './ValidatorSelector';
import { ValidatorType, useData } from 'src/contexts/DataProvider';
import ValidatorIcon from './ValidatorIcon';

export const PAIR_ROW_HEIGHT = 72;

const ModeRadio = ({label, selected, children, onClick}: {
  label: string,
  selected: Boolean,
  children: React.ReactNode,
  onClick?: () => void,
}) => {
  return <div onClick={onClick} className={selected ? "cursor-pointer w-full justify-between p-4 border rounded-lg border-[#98D7C3] bg-[#ECFAF5]" : "cursor-pointer w-full justify-between p-4 border rounded-lg border-[#EDF2F7] bg-[#F7FAFC]"}>
  <div className="flex w-full justify-between">
    <span className='text-xs text-[#4A5568] font-semibold mb-1'>{label}</span>
    {selected ? <span  className='mb-4 text-[#308D8A]'><FaCheckCircle/></span> : <span  className='mb-4 text-[#E2E8F0]'><FaRegCircle /></span>}
    </div>
    {children}
  </div>
}

const DelegationStrategy = ({
  onSubmit,
  tokenInfos,
  onClose,
}: {
  onSubmit?: (value: TokenInfo) => void;
  onClose: () => void;
  tokenInfos: TokenInfo[];
}) => {
  const [searchResult, setSearchResult] = useState<TokenInfo[]>(tokenInfos);
  const [showValidatorSelector, setShowValidatorSelector] = useState<boolean>();
  const { validators, setDelegationStrategy, delegationStrategy } = useData();
  const [selectedValidator, setSelectedValidator] = useState<ValidatorType | null>(delegationStrategy);

  const inputRef = createRef<HTMLInputElement>();
  useEffect(() => inputRef.current?.focus(), [inputRef]);

  if (showValidatorSelector) {
    return <ValidatorSelector
    onSubmit={(validator: ValidatorType) => {
      setSelectedValidator(validator);
      setDelegationStrategy(validator);
      setShowValidatorSelector(false);
    }}
    tokenInfos={tokenInfos}
    onClose={() => setShowValidatorSelector(false)}
    />
  }


  return (
    <div className="flex flex-col h-full w-full p-4 gap-4">
    <div className="flex w-full justify-between">
      <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={onClose}>
        <LeftArrowIcon width={24} height={24} />
      </div>

      <div className="text-[#4A5568] font-bold">Delegation strategy settings</div>

      <div className=" w-6 h-6" />
    </div>
    <ModeRadio
      selected={Boolean(!delegationStrategy)}
      onClick={() => setDelegationStrategy(null)}
      label={`Automatic (${validators.length} validators)`}
    >
      <span className='text-xs text-gray-500'>Automatically rebalance the stake on the most performing validators.</span>
    </ModeRadio>
    <ModeRadio
      selected={Boolean(delegationStrategy)}
      label='Manual (1 validator)'
      onClick={() => {
        if (selectedValidator) {
          setDelegationStrategy(selectedValidator);
        } else {
          setShowValidatorSelector(true);
        }
      }}
    >
      
      <button
                      type="button"
                      className="py-2 pr-3 pl-3 mb-2 w-full border-[#98D7C3]/50 border rounded-lg flex items-center hover:border-[#98D7C3]/75 justify-between"
                      onClick={() => setShowValidatorSelector(true)}
                    > 
                        {selectedValidator ? <span className='flex gap-4 items-center'><ValidatorIcon tokenInfo={selectedValidator} width={24} height={24} />{' '}<span className='text-xs text-gray-500'>{selectedValidator.name}</span></span> : <span className="text-xs text-gray-500">Select a validator</span>}
                        <span className="fill-current mx-2">
                          <ChevronDownIcon />
                        </span>
                    </button>
        <span className='text-xs text-gray-500'>Direct stake to a specific validator.  <a>See how it works</a></span>
    </ModeRadio>
    </div>
  );
};

export default DelegationStrategy;
