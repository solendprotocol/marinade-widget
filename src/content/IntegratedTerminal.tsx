import { Wallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { AllowedStakeModeType, DEFAULT_EXPLORER, FormProps, PaletteType, ThemeType } from 'src/types';
import { useDebouncedEffect } from 'src/misc/utils';

const IntegratedTerminal = (props: {
  rpcUrl: string;
  formProps: FormProps;
  theme: ThemeType;
  palette: PaletteType;
  stakeMode: AllowedStakeModeType;
  fakeWallet: Wallet | null;
  defaultExplorer: DEFAULT_EXPLORER;
}) => {
  const { stakeMode, rpcUrl, theme, palette, formProps, fakeWallet, defaultExplorer } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const launchTerminal = async () => {
    window.Marinade.init({
      displayMode: 'integrated',
      integratedTargetId: 'integrated-terminal',
      endpoint: rpcUrl,
      palette,
      formProps,
      stakeMode,
      theme,
      passThroughWallet: fakeWallet,
      defaultExplorer,
    });
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (!isLoaded || !window.Marinade.init) {
      intervalId = setInterval(() => {
        setIsLoaded(Boolean(window.Marinade.init));
      }, 500);
    }

    if (intervalId) {
      return () => clearInterval(intervalId);
    }
  }, []);

  useDebouncedEffect(
    () => {
      if (isLoaded && Boolean(window.Marinade.init)) {
        launchTerminal();
      }
    },
    [isLoaded, formProps, fakeWallet],
    200,
  );

  return (
    <div className="min-h-[600px] w-full rounded-2xl text-[#4A5568] flex flex-col items-center p-2 lg:p-4 mb-4 overflow-hidden mt-9">
      <div className="flex flex-col lg:flex-row h-full w-full overflow-auto">
        <div className="w-full h-full rounded-xl overflow-hidden flex justify-center">
          {/* Loading state */}
          {!isLoaded ? (
            <div className="h-full w-full animate-pulse bg-white/10 mt-4 lg:mt-0 lg:ml-4 flex items-center justify-center rounded-xl">
              <p className="">Loading...</p>
            </div>
          ) : null}

          <div
            id="integrated-terminal"
            className={`flex h-full w-full max-w-[384px] overflow-auto justify-center bg-[#fff] rounded-xl ${
              !isLoaded ? 'hidden' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegratedTerminal;
