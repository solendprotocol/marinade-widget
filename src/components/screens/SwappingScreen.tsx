import React, { useEffect, useMemo, useState } from 'react';
import { useScreenState } from 'src/contexts/ScreenProvider';
import { useSwapContext } from 'src/contexts/SwapContext';
import JupButton from '../JupButton';
import SexyChameleonText from '../SexyChameleonText/SexyChameleonText';
import SuccessIcon from 'src/icons/SuccessIcon';
import { usePreferredExplorer } from 'src/contexts/preferredExplorer';
import { useData } from 'src/contexts/DataProvider';

const ErrorIcon = () => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_7547_116874)">
        <circle cx="20" cy="20" r="20" fill="#F04A44" />
        <path
          d="M19.8444 25.4321C18.6773 25.4332 17.7205 24.5092 17.6793 23.3431L17.1718 9.04107C17.1507 8.45326 17.3706 7.88344 17.7786 7.46056C18.1867 7.03768 18.7492 6.7998 19.337 6.7998H20.3519C20.9397 6.7998 21.5021 7.03768 21.9102 7.46056C22.3183 7.88344 22.5382 8.45329 22.5171 9.04107L22.0096 23.3431C21.9684 24.5092 21.0116 25.4332 19.8444 25.4321Z"
          fill="white"
        />
        <path
          d="M22.8893 30.4989C22.8893 32.1809 21.5266 33.5436 19.8446 33.5436C18.1626 33.5436 16.7998 32.1809 16.7998 30.4989C16.7998 28.8169 18.1626 27.4541 19.8446 27.4541C21.5266 27.4541 22.8893 28.8169 22.8893 30.4989Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_7547_116874">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const SwappingScreen = () => {
  const {
    displayMode,
    lastSwapResult,
    reset,
    scriptDomain,
    swapping: { totalTxs, txStatus },
    selectedSwapRoute,
    fromTokenInfo,
    toTokenInfo,
    jupiter: { routes, refresh },
  } = useSwapContext();
  const { context, screen, setScreen } = useScreenState();
  const { target, palette } = useData();

  const onSwapMore = () => {
    reset();
    setScreen('Initial');
    refresh();
  };

  const onGoBack = () => {
    reset({ resetValues: false });
    setScreen('Initial');
    refresh();
  };

  useEffect(() => {
    if (screen !== 'Swapping') return;

    if (lastSwapResult && 'error' in lastSwapResult) {

      if (window.Marinade.onSwapError) {
        window.Marinade.onSwapError({ error: lastSwapResult.error });
      }
      return;
    } else if (lastSwapResult && 'txid' in lastSwapResult) {
      if (window.Marinade.onSuccess) {
        window.Marinade.onSuccess({ txid: lastSwapResult.txid, swapResult: lastSwapResult });
      }
      return;
    }
  }, [lastSwapResult]);

  const onClose = () => {
    if (!displayMode || displayMode === 'modal') {
      window.Marinade.close();
    }

    reset();
    setScreen('Initial');
  };

  const swapState: 'success' | 'error' | 'loading' = useMemo(() => {
    const hasErrors = txStatus.find((item) => item.status === 'fail');
    if (hasErrors) {
      return 'error';
    }

    const allSuccess = txStatus.every((item) => item.status !== 'loading');
    if (txStatus.length > 0 && allSuccess) {
      return 'success';
    }

    return 'loading';
  }, [txStatus]);

  const { explorer, getExplorer } = usePreferredExplorer();

  const Content = ({text}: {text: string}) => {
    return (
      <>
        <div className="flex w-full justify-center">
          <div style={{
            color: palette.text
          }}>{swapState === 'loading' ? 'Staking...' : ''}</div>
        </div>

        <div className="flex w-full justify-center items-center mt-9">
          <div
  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
  role="status"
  >
  <span
    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >Loading...</span>
</div>
        </div>

        {totalTxs === 0 ? (
          <span className="text-center mt-8 text-sm px-4" style={{
            color: palette.disabledText
          }}>{text}</span>
        ) : null}
      </>
    );
  };

  const SuccessContent = () => {
    const explorerLink = context?.message ? getExplorer(context.message) : null;

    return (
      <>
        <div className="flex justify-center mt-12">
          <div className="absolute top-[68px] bg-[#23C1AA] bg-opacity-[15%] rounded-full w-20 h-20 flex justify-center items-center animate-pulse" />

          <div className="h-[56px] w-[56px] bg-white rounded-full">
            <SuccessIcon />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <p className="mt-5 text-xl font-semibold" style={{
            color: palette.text
          }}>Staking successful</p>

          <div className="mt-4 rounded-xl overflow-y-auto w-full webkit-scrollbar py-4 max-h-[260px]" style={{
            background: palette.secondaryBg
          }}>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <p className="text-xs font-semibold" style={{
                color: palette.invertedPrimaryBg
              }}>
                Successfully staked {target?.amount} SOL!
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
        {explorerLink ? (
          <a
            href={explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer mt-2 ml-2 text-xs hover:underline"
            style={{
              color: palette.primary
            }}
          >
            View on {explorer}
          </a>
        ) : null}
</div>
        <div className="mt-auto px-5 pb-4 flex space-x-2">
          <JupButton size="lg" className="w-full mt-4" type="button" onClick={() => {
            if (context.callback) {
              context.callback();
            }
          }}>
            <SexyChameleonText >
              <span className="text-sm">Stake more</span>
            </SexyChameleonText>
          </JupButton>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      {screen === 'Error' ? (
        <div className="flex justify-center">
          <div className="flex flex-col items-center justify-center text-center">
            <ErrorIcon />

            <p className=" mt-2" style={{
              color: palette.text
            }}>Transaction failed</p>
            <p className="text-xs mt-2" style={{
              color: palette.disabledText
            }}>{context.message}</p>

            <JupButton size="lg" className="w-full mt-6 disabled:opacity-50" type="button" onClick={onGoBack}>
              <SexyChameleonText>Back</SexyChameleonText>
            </JupButton>
          </div>
        </div>
      ) : null}

      {screen === 'Signing' ? <Content text="Awaiting approval from your wallet..." /> : null}
      {screen === 'Confirming' ? <Content text="Transaction sent. Awaiting confirmation..." /> : null}
      {screen === 'Success' ? <SuccessContent /> : null}
    </div>
  );
};

export default SwappingScreen;
