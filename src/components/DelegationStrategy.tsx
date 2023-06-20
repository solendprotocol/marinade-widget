import { TokenInfo } from '@solana/spl-token-registry';
import React, { createRef, useEffect, useState } from 'react';
import LeftArrowIcon from 'src/icons/LeftArrowIcon';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa'
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
  const { palette } = useData();
  return <div onClick={onClick} className={selected ? "cursor-pointer w-full justify-between p-4 border rounded-lg" : "cursor-pointer w-full justify-between p-4 border rounded-lg"}
  style={{
    color: palette.text,
    background: selected ? palette.secondaryBg : palette.secondaryBg,
    borderColor: selected ? palette.primary : palette.secondary
  }}>
  <div className="flex w-full justify-between">
    <span className='text-xsfont-semibold mb-1' style={{
      color: palette.disabledText
    }}>{label}</span>
    {selected ? <span  className='mb-4' style={{
      color: palette.primary
    }}><FaCheckCircle/></span> : <span  className='mb-4' style={{
      color: palette.secondary
    }}><FaRegCircle /></span>}
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
  const { palette } = useData();

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
    <div className="flex flex-col h-full w-full p-4 gap-4" 
    style={{
      color: palette.text,
      background: palette.primaryBg
    }}>
    <div className="flex w-full justify-between">
      <div className="fill-current w-6 h-6 cursor-pointer" onClick={onClose} 
    style={{
      color: palette.text,
    }}>
        <LeftArrowIcon width={24} height={24} />
      </div>

      <div className="font-bold"
    style={{
      color: palette.text,
    }}>Delegation strategy settings</div>

      <div className=" w-6 h-6" />
    </div>
    <ModeRadio
      selected={Boolean(!delegationStrategy)}
      onClick={() => setDelegationStrategy(null)}
      label={`Automatic (${validators.length} validators)`}
    >
      <span className='text-xs'>Automatically rebalance the stake on the most performing validators.</span>
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
                      className="py-2 pr-3 pl-3 mb-2 w-full border rounded-lg flex items-center hover:opacity-50 justify-between"
                      style={{
                        borderColor: palette.secondary
                      }}
                      onClick={() => setShowValidatorSelector(true)}
                    > 
                        {selectedValidator ? <span className='flex gap-4 items-center'><ValidatorIcon tokenInfo={selectedValidator} width={24} height={24} />{' '}<span className='text-xs'>{selectedValidator.name}</span></span> : <span className="text-xs">Select a validator</span>}
                        <span className="fill-current mx-2">
                          <ChevronDownIcon />
                        </span>
                    </button>
        <span className='text-xs'>Direct stake to a specific validator.  <a>See how it works</a></span>
    </ModeRadio>
    </div>
  );
};

export default DelegationStrategy;
