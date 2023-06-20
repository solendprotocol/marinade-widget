import React from 'react';

const MarinadeLogo: React.FC<{ width?: number; height?: number }> = ({ width = 24, height = 24 }) => {
  return <img src={'https://jup.ag/svg/jupiter-logo.svg'} width={width} height={height} alt="Marinade aggregator" />;
};

export default MarinadeLogo;
