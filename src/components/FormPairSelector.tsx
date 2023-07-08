import { TokenInfo } from '@solana/spl-token-registry';
import React, { createRef, useEffect } from 'react';
import LeftArrowIcon from 'src/icons/LeftArrowIcon';
import FormPairRow from './FormPairRow';
import { useData } from 'src/contexts/DataProvider';
import { useTheme } from 'src/contexts/ThemeProvider';
import FormAccountRow from './FormAccountRow';

export const PAIR_ROW_HEIGHT = 72;

const FormPairSelector = ({ tokenInfos, onClose }: { onClose: () => void; tokenInfos: TokenInfo[] }) => {
  const { stakeAccounts, setTarget } = useData();
  const { palette } = useTheme();
  const inputRef = createRef<HTMLInputElement>();
  useEffect(() => inputRef.current?.focus(), [inputRef]);

  const solAccount = tokenInfos.find((r) => r.symbol === 'SOL');

  return (
    <div
      className="flex flex-col h-full w-full p-4"
      style={{
        background: palette.primaryBg,
      }}
    >
      <div className="flex w-full justify-between">
        <div
          className="fill-current w-6 h-6 cursor-pointer"
          style={{
            color: palette.text,
          }}
          onClick={onClose}
        >
          <LeftArrowIcon width={24} height={24} />
        </div>

        <div
          className="font-bold"
          style={{
            color: palette.text,
          }}
        >
          Select token or stake account
        </div>

        <div className=" w-6 h-6" />
      </div>
      <div className="mt-2 ![overflow:overlay]">
        {solAccount && (
          <FormPairRow
            key="SOL"
            item={{
              ...solAccount,
              name: 'Solana',
            }}
            style={{}}
            onSubmit={() => {
              setTarget({
                type: 'native',
              });

              onClose();
            }}
          />
        )}
        <span
          className="pl-2 text-xs font-semibold"
          style={{
            color: palette.text,
          }}
        >
          Stake accounts
        </span>
        {stakeAccounts
          .filter((s) => s.status === 'active')
          .map((r) => (
            <FormAccountRow
              key={r.address}
              item={r}
              style={{}}
              onSubmit={() => {
                setTarget({
                  type: 'stakeAccount',
                  stakeAccount: r,
                  amount: Number(r.balance),
                });
                onClose();
              }}
            />
          ))}
        {stakeAccounts
          .filter((s) => s.status === 'inactive')
          .map((r) => (
            <FormAccountRow
              key={r.address}
              item={r}
              style={{}}
              onSubmit={() => {
                setTarget({
                  type: 'stakeAccount',
                  stakeAccount: r,
                  amount: Number(r.balance),
                });
                onClose();
              }}
            />
          ))}
        {stakeAccounts
          .filter((s) => s.status === 'minBalance')
          .map((r) => (
            <FormAccountRow
              disabled
              key={r.address}
              item={r}
              style={{}}
              onSubmit={() => {
                setTarget({
                  type: 'stakeAccount',
                  stakeAccount: r,
                  amount: Number(r.balance),
                });
                onClose();
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default FormPairSelector;
