import { TokenInfo } from '@solana/spl-token-registry';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import LeftArrowIcon from 'src/icons/LeftArrowIcon';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import ChevronDownIcon from 'src/icons/ChevronDownIcon';
import ValidatorSelector from './ValidatorSelector';
import { ValidatorType, useData } from 'src/contexts/DataProvider';
import { useTheme } from 'src/contexts/ThemeProvider';
import ValidatorIcon from './ValidatorIcon';
import ActionButton from './ActionButton';

export const PAIR_ROW_HEIGHT = 72;

const ModeRadio = ({
  label,
  selected,
  children,
  onClick,
}: {
  label: string;
  selected: Boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const { palette } = useTheme();
  return (
    <div
      onClick={onClick}
      className={
        selected
          ? 'cursor-pointer w-full justify-between p-4 border rounded-lg'
          : 'cursor-pointer w-full justify-between p-4 border rounded-lg'
      }
      style={{
        color: palette.text,
        background: palette.secondaryBg,
        borderColor: selected ? palette.primary : palette.secondary,
      }}
    >
      <div className="flex w-full justify-between">
        <span
          className="text-xs font-semibold mb-1"
          style={{
            color: palette.disabledText,
          }}
        >
          {label}
        </span>
        {selected ? (
          <span
            className="mb-4"
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
      {children}
    </div>
  );
};

const DelegationStrategy = ({ tokenInfos, onClose }: { onClose: () => void; tokenInfos: TokenInfo[] }) => {
  const [showValidatorSelector, setShowValidatorSelector] = useState<boolean>();
  const { validators, delegationStrategy, setDelegationStrategy } = useData();
  const [isAuto, setIsAuto] = useState(!delegationStrategy);
  const [selectedValidator, setSelectedValidator] = useState<ValidatorType | null>(delegationStrategy);
  const { palette } = useTheme();

  const inputRef = createRef<HTMLInputElement>();
  useEffect(() => inputRef.current?.focus(), [inputRef]);

  const save = useCallback(() => {
    setDelegationStrategy(isAuto ? null : selectedValidator);
  }, [setDelegationStrategy, isAuto, selectedValidator]);

  if (showValidatorSelector) {
    return (
      <ValidatorSelector
        onSubmit={(validator: ValidatorType) => {
          setSelectedValidator(validator);
          setShowValidatorSelector(false);
        }}
        tokenInfos={tokenInfos}
        onClose={() => setShowValidatorSelector(false)}
      />
    );
  }

  return (
    <div
      className="flex flex-col justify-between h-full w-full p-4 "
      style={{
        color: palette.text,
        background: palette.primaryBg,
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex w-full justify-between">
          <div
            className="fill-current w-6 h-6 cursor-pointer"
            onClick={onClose}
            style={{
              color: palette.text,
            }}
          >
            <LeftArrowIcon width={24} height={24} />
          </div>

          <div
            className="font-bold"
            style={{
              color: palette.text,
            }}
          >
            Delegation strategy settings
          </div>

          <div className=" w-6 h-6" />
        </div>
        <ModeRadio
          selected={isAuto}
          onClick={() => setIsAuto(true)}
          label={`Automatic (${validators.length} validators)`}
        >
          <span className="text-xs">Automatically rebalance the stake on the most performing validators.</span>
        </ModeRadio>
        <ModeRadio
          selected={!isAuto}
          label="Manual (1 validator)"
          onClick={() => {
            if (selectedValidator) {
              setSelectedValidator(selectedValidator);
            } else {
              setShowValidatorSelector(true);
            }
            setIsAuto(false);
          }}
        >
          <button
            type="button"
            className="py-2 pr-3 pl-3 mb-2 w-full border rounded-lg flex items-center hover:opacity-50 justify-between"
            style={{
              borderColor: palette.secondary,
              background: palette.primaryBg,
            }}
            disabled={!Boolean(validators.length)}
            onClick={() => setShowValidatorSelector(true)}
          >
            {selectedValidator ? (
              <span className="flex gap-4 items-center">
                <ValidatorIcon tokenInfo={selectedValidator} width={24} height={24} />{' '}
                <span className="text-xs">{selectedValidator.name}</span>
              </span>
            ) : (
              <span className="text-xs">
                {validators.length ? 'Select a validator' : null}
                {!validators.length ? 'Loading...' : null}
              </span>
            )}
            <span className="fill-current mx-2">
              <ChevronDownIcon />
            </span>
          </button>
          <span className="text-xs">
            Direct stake to a specific validator.{' '}
            <a
              href="https://docs.marinade.finance/marinade-protocol/validators"
              rel="noreferrer"
              target={'_blank'}
              className="cursor-pointer"
            >
              See how it works
            </a>
          </span>
        </ModeRadio>
      </div>
      <ActionButton
        onClick={() => {
          save();
          onClose();
        }}
      >
        Save settings
      </ActionButton>
    </div>
  );
};

export default DelegationStrategy;
