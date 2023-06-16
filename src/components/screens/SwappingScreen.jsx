"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ScreenProvider_1 = require("src/contexts/ScreenProvider");
const SwapContext_1 = require("src/contexts/SwapContext");
const JupButton_1 = __importDefault(require("../JupButton"));
const SexyChameleonText_1 = __importDefault(require("../SexyChameleonText/SexyChameleonText"));
const SuccessIcon_1 = __importDefault(require("src/icons/SuccessIcon"));
const preferredExplorer_1 = require("src/contexts/preferredExplorer");
const DataProvider_1 = require("src/contexts/DataProvider");
const ErrorIcon = () => {
    return (<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_7547_116874)">
        <circle cx="20" cy="20" r="20" fill="#F04A44"/>
        <path d="M19.8444 25.4321C18.6773 25.4332 17.7205 24.5092 17.6793 23.3431L17.1718 9.04107C17.1507 8.45326 17.3706 7.88344 17.7786 7.46056C18.1867 7.03768 18.7492 6.7998 19.337 6.7998H20.3519C20.9397 6.7998 21.5021 7.03768 21.9102 7.46056C22.3183 7.88344 22.5382 8.45329 22.5171 9.04107L22.0096 23.3431C21.9684 24.5092 21.0116 25.4332 19.8444 25.4321Z" fill="white"/>
        <path d="M22.8893 30.4989C22.8893 32.1809 21.5266 33.5436 19.8446 33.5436C18.1626 33.5436 16.7998 32.1809 16.7998 30.4989C16.7998 28.8169 18.1626 27.4541 19.8446 27.4541C21.5266 27.4541 22.8893 28.8169 22.8893 30.4989Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_7547_116874">
          <rect width="40" height="40" fill="white"/>
        </clipPath>
      </defs>
    </svg>);
};
const SwappingScreen = () => {
    const { displayMode, lastSwapResult, reset, scriptDomain, swapping: { totalTxs, txStatus }, selectedSwapRoute, fromTokenInfo, toTokenInfo, jupiter: { routes, refresh }, } = (0, SwapContext_1.useSwapContext)();
    const { context, screen, setScreen } = (0, ScreenProvider_1.useScreenState)();
    const { target } = (0, DataProvider_1.useData)();
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const onSwapMore = () => {
        reset();
        setErrorMessage('');
        setScreen('Initial');
        refresh();
    };
    const onGoBack = () => {
        reset({ resetValues: false });
        setErrorMessage('');
        setScreen('Initial');
        refresh();
    };
    (0, react_1.useEffect)(() => {
        var _a;
        if (screen !== 'Swapping')
            return;
        if (lastSwapResult && 'error' in lastSwapResult) {
            setErrorMessage(((_a = lastSwapResult.error) === null || _a === void 0 ? void 0 : _a.message) || '');
            if (window.Jupiter.onSwapError) {
                window.Jupiter.onSwapError({ error: lastSwapResult.error });
            }
            return;
        }
        else if (lastSwapResult && 'txid' in lastSwapResult) {
            if (window.Jupiter.onSuccess) {
                window.Jupiter.onSuccess({ txid: lastSwapResult.txid, swapResult: lastSwapResult });
            }
            return;
        }
    }, [lastSwapResult]);
    const onClose = () => {
        if (!displayMode || displayMode === 'modal') {
            window.Jupiter.close();
        }
        reset();
        setScreen('Initial');
    };
    const swapState = (0, react_1.useMemo)(() => {
        const hasErrors = txStatus.find((item) => item.status === 'fail');
        if (hasErrors || errorMessage) {
            return 'error';
        }
        const allSuccess = txStatus.every((item) => item.status !== 'loading');
        if (txStatus.length > 0 && allSuccess) {
            return 'success';
        }
        return 'loading';
    }, [txStatus]);
    const { explorer, getExplorer } = (0, preferredExplorer_1.usePreferredExplorer)();
    const Content = ({ text }) => {
        return (<>
        <div className="flex w-full justify-center">
          <div className="text-[#4A5568]">{swapState === 'loading' ? 'Staking...' : ''}</div>
        </div>

        <div className="flex w-full justify-center items-center mt-9">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        </div>

        {totalTxs === 0 ? (<span className="text-[#4A5568] text-center mt-8 text-sm px-4">{text}</span>) : null}
      </>);
    };
    const SuccessContent = () => {
        const explorerLink = (context === null || context === void 0 ? void 0 : context.message) ? getExplorer(context.message) : null;
        return (<>
        <div className="flex justify-center mt-12">
          <div className="absolute top-[68px] bg-[#23C1AA] bg-opacity-[15%] rounded-full w-20 h-20 flex justify-center items-center animate-pulse"/>

          <div className="h-[56px] w-[56px] bg-white rounded-full">
            <SuccessIcon_1.default />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <p className="mt-5 text-[#4A5568] text-xl font-semibold">Staking successful</p>

          <div className="mt-4 bg-[#F7FAFC] rounded-xl overflow-y-auto w-full webkit-scrollbar py-4 max-h-[260px]">
            <div className="mt-2 flex flex-col items-center justify-center text-center px-4">
              <p className="text-xs font-semibold text-[#4A5568]/75">
                Successfully staked {target === null || target === void 0 ? void 0 : target.amount} SOL!
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
        {explorerLink ? (<a href={explorerLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-[#4A5568]/50 mt-2 ml-2 text-xs hover:underline">
            View on {explorer}
          </a>) : null}
        </div>
        <div className="mt-auto px-5 pb-4 flex space-x-2">
          <JupButton_1.default size="lg" className="w-full mt-4 bg-[#308D8A]" type="button" onClick={() => {
                if (context.callback) {
                    context.callback();
                }
            }}>
            <SexyChameleonText_1.default>
              <span className="text-sm">Stake more</span>
            </SexyChameleonText_1.default>
          </JupButton_1.default>
        </div>
      </>);
    };
    return (<div className="flex flex-col h-full w-full py-4 px-2">
      {screen === 'Error' ? (<div className="flex justify-center">
          <div className="flex flex-col items-center justify-center text-center mt-12">
            <ErrorIcon />

            <p className="text-[#4A5568] mt-2">Transaction failed</p>
            <p className="text-[#4A5568]/50 text-xs mt-2">{context.message}</p>
            {errorMessage ? <p className="text-[#4A5568]/50 text-xs mt-2">{errorMessage}</p> : ''}

            <JupButton_1.default size="lg" className="w-full mt-6 disabled:opacity-50 bg-[#308D8A]" type="button" onClick={onGoBack}>
              <SexyChameleonText_1.default>Back</SexyChameleonText_1.default>
            </JupButton_1.default>
          </div>
        </div>) : null}

      {screen === 'Signing' ? <Content text="Awaiting approval from your wallet..."/> : null}
      {screen === 'Confirming' ? <Content text="Transaction sent. Awaiting confirmation..."/> : null}
      {screen === 'Success' ? <SuccessContent /> : null}
      {!errorMessage && swapState === 'success' ? <SuccessContent /> : null}
    </div>);
};
exports.default = SwappingScreen;
