import React from 'react';

const MarinadeCircle: React.FC<{ width?: number; height?: number }> = ({ width = 24, height = 24 }) => {
    return (
        <img src={'MNDE.svg'} width={width} height={height} alt="Marinade aggregator" />
    );
  };
  
  export default MarinadeCircle;
  