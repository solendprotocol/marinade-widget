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
const math_1 = require("@jup-ag/math");
const react_hook_1 = require("@jup-ag/react-hook");
const classnames_1 = __importDefault(require("classnames"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const jsbi_1 = __importDefault(require("jsbi"));
const react_1 = __importStar(require("react"));
const SwapContext_1 = require("src/contexts/SwapContext");
const WalletPassthroughProvider_1 = require("src/contexts/WalletPassthroughProvider");
const utils_1 = require("src/misc/utils");
const ExchangeRate_1 = __importDefault(require("../ExchangeRate"));
const Deposits_1 = __importDefault(require("./Deposits"));
const Fees_1 = __importDefault(require("./Fees"));
const TransactionFee_1 = __importDefault(require("./TransactionFee"));
const Index = ({ routes, selectedSwapRoute, fromTokenInfo, toTokenInfo, loading, showFullDetails = false, containerClassName, }) => {
    var _a, _b, _c, _d;
    const rateParams = {
        inAmount: (selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.inAmount) || ((_a = routes === null || routes === void 0 ? void 0 : routes[0]) === null || _a === void 0 ? void 0 : _a.inAmount) || math_1.ZERO,
        inputDecimal: fromTokenInfo.decimals,
        outAmount: (selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.outAmount) || ((_b = routes === null || routes === void 0 ? void 0 : routes[0]) === null || _b === void 0 ? void 0 : _b.outAmount) || math_1.ZERO,
        outputDecimal: toTokenInfo.decimals,
    };
    const { wallet } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const walletPublicKey = (0, react_1.useMemo)(() => { var _a; return (_a = wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey) === null || _a === void 0 ? void 0 : _a.toString(); }, [wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey]);
    const priceImpact = utils_1.formatNumber.format(new decimal_js_1.default((selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.priceImpactPct) || 0).mul(100).toDP(4).toNumber());
    const priceImpactText = Number(priceImpact) < 0.1 ? `< ${utils_1.formatNumber.format(0.1)}%` : `~ ${priceImpact}%`;
    const otherAmountThresholdText = (0, react_1.useMemo)(() => {
        if (selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.otherAmountThreshold) {
            const amount = new decimal_js_1.default(selectedSwapRoute.otherAmountThreshold.toString()).div(Math.pow(10, toTokenInfo.decimals));
            const amountText = utils_1.formatNumber.format(amount.toNumber());
            return `${amountText} ${toTokenInfo.symbol}`;
        }
        return '-';
    }, [selectedSwapRoute]);
    const [feeInformation, setFeeInformation] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        setFeeInformation(undefined);
        if (selectedSwapRoute.fees) {
            setFeeInformation(selectedSwapRoute.fees);
        }
    }, [selectedSwapRoute, walletPublicKey]);
    const hasAtaDeposit = ((_c = feeInformation === null || feeInformation === void 0 ? void 0 : feeInformation.ataDeposits.length) !== null && _c !== void 0 ? _c : 0) > 0;
    const hasSerumDeposit = ((_d = feeInformation === null || feeInformation === void 0 ? void 0 : feeInformation.openOrdersDeposits.length) !== null && _d !== void 0 ? _d : 0) > 0;
    const { jupiter: { priorityFeeInSOL } } = (0, SwapContext_1.useSwapContext)();
    return (<div className={(0, classnames_1.default)('mt-4 space-y-4 border border-white/5 rounded-xl p-3', containerClassName)}>
      <div className="flex items-center justify-between text-xs">
        <div className="text-[#4A5568]/30">{<span>Rate</span>}</div>
        {jsbi_1.default.greaterThan(rateParams.inAmount, math_1.ZERO) && jsbi_1.default.greaterThan(rateParams.outAmount, math_1.ZERO) ? (<ExchangeRate_1.default loading={loading} rateParams={rateParams} fromTokenInfo={fromTokenInfo} toTokenInfo={toTokenInfo} reversible={true}/>) : (<span className="text-[#4A5568]/30">{'-'}</span>)}
      </div>

      <div className="flex items-center justify-between text-xs text-[#4A5568]/30">
        <div>
          <span>Price Impact</span>
        </div>
        <div>{priceImpactText}</div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="text-[#4A5568]/30">
          {(selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.swapMode) === react_hook_1.SwapMode.ExactIn ? (<span>Minimum Received</span>) : (<span>Maximum Consumed</span>)}
        </div>
        <div className="text-[#4A5568]/30">{otherAmountThresholdText}</div>
      </div>

      {showFullDetails ? (<>
          <Fees_1.default marketInfos={selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.marketInfos}/>
          <TransactionFee_1.default feeInformation={feeInformation}/>
          <Deposits_1.default hasSerumDeposit={hasSerumDeposit} hasAtaDeposit={hasAtaDeposit} feeInformation={feeInformation}/>

          {priorityFeeInSOL > 0 ? (<div className="flex items-center justify-between text-xs">
              <div className="text-[#4A5568]/30">
                Priority Fee
              </div>
              <div className="text-[#4A5568]/30">{new decimal_js_1.default(priorityFeeInSOL).toString()}</div>
            </div>) : null}
        </>) : null}
    </div>);
};
exports.default = Index;
