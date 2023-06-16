import React, { FC, MouseEvent, useCallback } from 'react';
import { useWalletPassThrough } from 'src/contexts/WalletPassthroughProvider';

export const WalletModalButton: FC<{ setIsWalletModalOpen(toggle: boolean): void }> = ({ setIsWalletModalOpen }) => {
  const { connecting } = useWalletPassThrough();

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setIsWalletModalOpen(true);
  }, []);

  return (
    <button
      type="button"
      className="py-2 px-3 h-7 flex items-center rounded-lg text-xs bg-[#EDF2F7] text-[#4A5568]"
      onClick={handleClick}
    >
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
