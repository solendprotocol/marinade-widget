"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ScreenProvider_1 = require("src/contexts/ScreenProvider");
const SwapContext_1 = require("src/contexts/SwapContext");
const LeftArrowIcon_1 = __importDefault(require("src/icons/LeftArrowIcon"));
const useTimeDiff_1 = __importDefault(require("../useTimeDiff/useTimeDiff"));
const index_1 = __importDefault(require("../PriceInfo/index"));
const JupButton_1 = __importDefault(require("../JupButton"));
const SexyChameleonText_1 = __importDefault(require("../SexyChameleonText/SexyChameleonText"));
const ConfirmationScreen = () => {
    const { fromTokenInfo, toTokenInfo, onSubmit: onSubmitJupiter, selectedSwapRoute, jupiter: { routes, loading, refresh }, } = (0, SwapContext_1.useSwapContext)();
    const [hasExpired] = (0, useTimeDiff_1.default)();
    const { setScreen } = (0, ScreenProvider_1.useScreenState)();
    const onGoBack = () => {
        refresh();
        setScreen('Initial');
    };
    const onSubmit = () => {
        setScreen('Swapping');
        onSubmitJupiter();
    };
    return (<div className="flex flex-col h-full w-full py-4 px-2">
      <div className="flex w-full justify-between">
        <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={onGoBack}>
          <LeftArrowIcon_1.default width={24} height={24}/>
        </div>

        <div className="text-[#4A5568]">Review Order</div>

        <div className=" w-6 h-6"/>
      </div>

      <div>
        {routes && selectedSwapRoute && fromTokenInfo && toTokenInfo ? (<index_1.default routes={routes} selectedSwapRoute={selectedSwapRoute} fromTokenInfo={fromTokenInfo} toTokenInfo={toTokenInfo} loading={loading} showFullDetails containerClassName="bg-[#25252D] border-none"/>) : null}
      </div>

      {hasExpired ? (<JupButton_1.default size="lg" className="w-full mt-4 disabled:opacity-50 !p-0" type="button" onClick={onGoBack}>
          <span className="text-sm">Refresh</span>
        </JupButton_1.default>) : (<JupButton_1.default size="lg" className="w-full mt-4 disabled:opacity-50" type="button" onClick={onSubmit}>
          <SexyChameleonText_1.default>Confirm</SexyChameleonText_1.default>
        </JupButton_1.default>)}
    </div>);
};
exports.default = ConfirmationScreen;
