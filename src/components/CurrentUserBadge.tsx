import React from 'react';
import { useWalletPassThrough } from 'src/contexts/WalletPassthroughProvider';

import { shortenAddress } from '../misc/utils';

export const CurrentUserBadge: React.FC = () => {
  const { publicKey, wallet } = useWalletPassThrough();

  if (!wallet || !publicKey) {
    return null;
  }

  return (
    <div className="flex items-center py-2 px-3 rounded-lg h-7">
      <div className="w-4 h-4 rounded-full flex justify-center items-center" style={{ position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Wallet logo" width={16} height={16} src={wallet?.adapter?.icon} />
      </div>

      <div className="ml-2 font-semibold font-['Inter']">
        <div className="text-xs">{shortenAddress(`${publicKey}`)}</div>
      </div>
    </div>
  );
};
