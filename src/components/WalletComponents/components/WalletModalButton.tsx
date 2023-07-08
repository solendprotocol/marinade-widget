import React, { FC, MouseEvent, useCallback } from 'react';
import { useTheme } from 'src/contexts/ThemeProvider';
import { useWalletPassThrough } from 'src/contexts/WalletPassthroughProvider';
import { BsWallet } from 'react-icons/bs';

export const WalletModalButton: FC<{ setIsWalletModalOpen(toggle: boolean): void }> = ({ setIsWalletModalOpen }) => {
  const { connecting } = useWalletPassThrough();
  const { palette } = useTheme();

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setIsWalletModalOpen(true);
  }, []);

  return (
    <button
      type="button"
      className="py-2 px-3 h-7 flex items-center rounded-lg text-xs ml-2 font-semibold font-['Inter']"
      style={{
        background: palette.secondaryBg,
        color: palette.text,
      }}
      onClick={handleClick}
    >
      <BsWallet className="mr-1" />
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
