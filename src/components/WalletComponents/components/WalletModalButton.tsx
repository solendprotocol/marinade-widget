import React, { FC, MouseEvent, useCallback } from 'react';
import { useData } from 'src/contexts/DataProvider';
import { useWalletPassThrough } from 'src/contexts/WalletPassthroughProvider';
import { BsWallet } from 'react-icons/bs'

export const WalletModalButton: FC<{ setIsWalletModalOpen(toggle: boolean): void }> = ({ setIsWalletModalOpen }) => {
  const { connecting } = useWalletPassThrough();
  const { palette } = useData();

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setIsWalletModalOpen(true);
  }, []);

  return (
    <button
      type="button"
      className="py-2 px-3 h-7 flex items-center rounded-lg text-xs"
      style={{
        background: palette.secondaryBg,
        color: palette.text
      }}
      onClick={handleClick}
    >
      <BsWallet className='mr-1'/>
      {connecting ? (
        <span>
          <span>Connecting...</span>
        </span>
      ) : (
        <span>
          <span>Connect Wallet</span>
        </span>
      )}
    </button>
  );
};
