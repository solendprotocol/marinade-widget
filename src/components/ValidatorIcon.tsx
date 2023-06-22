import React, { useState } from 'react';
import { ValidatorType } from 'src/contexts/DataProvider';

const ValidatorIcon: React.FC<{ tokenInfo?: ValidatorType | null; width?: number; height?: number }> = ({
  tokenInfo,
  width = 24,
  height = 24,
}) => {
  const [error, setError] = useState(false);

  return (
    <div className="text-xs flex items-center justify-center rounded-full overflow-hidden" style={{ width, height }}>
      {tokenInfo && !error ? (
        <img
          onError={() => setError(true)}
          src={tokenInfo?.logo ?? ''}
          alt={tokenInfo?.name}
          width={width}
          height={height}
        />
      ) : (
        <div
          className="items-center justify-center rounded-full overflow-hidden bg-black/20"
          style={{ width, height }}
        />
      )}
    </div>
  );
};

export default ValidatorIcon;
