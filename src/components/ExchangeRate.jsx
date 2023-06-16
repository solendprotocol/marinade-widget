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
exports.calculateRate = void 0;
const classnames_1 = __importDefault(require("classnames"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const React = __importStar(require("react"));
const utils_1 = require("../misc/utils");
const PrecisionTickSize_1 = __importDefault(require("./PrecisionTickSize"));
const calculateRate = ({ inAmount, inputDecimal, outAmount, outputDecimal }, reverse) => {
    const input = (0, utils_1.fromLamports)(inAmount, inputDecimal);
    const output = (0, utils_1.fromLamports)(outAmount, outputDecimal);
    const rate = !reverse ? new decimal_js_1.default(input).div(output) : new decimal_js_1.default(output).div(input);
    if (Number.isNaN(rate.toNumber())) {
        return new decimal_js_1.default(0);
    }
    return rate;
};
exports.calculateRate = calculateRate;
const ApproxSVG = ({ width = 16, height = 16 }) => {
    return (<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.8573 8.18429L13.6323 5.95933L10.8573 3.73438V5.31937H3.32735V6.59937H10.8573V8.18429ZM5.14223 7.81429L2.36719 10.0393L5.14223 12.2642V10.6792H12.6722V9.39922H5.14223V7.81429Z" fill="#777777"/>
    </svg>);
};
const ExchangeRate = ({ className, textClassName, loading = false, fromTokenInfo, rateParams, toTokenInfo, reversible = true, }) => {
    const [reverse, setReverse] = React.useState(reversible !== null && reversible !== void 0 ? reversible : true);
    const rate = React.useMemo(() => (0, exports.calculateRate)(rateParams, reverse), [loading, reverse, rateParams]);
    const onReverse = React.useCallback((event) => {
        event.stopPropagation();
        setReverse((prevState) => !prevState);
    }, []);
    return (<div className={(0, classnames_1.default)(className, 'flex cursor-pointer text-[#4A5568]/30 text-xs align-center')} onClick={onReverse}>
      <span className={(0, classnames_1.default)(textClassName, 'max-w-full flex whitespace-nowrap')}>
        {reverse ? (<>
            1 {fromTokenInfo.symbol} ≈
            <div className='flex ml-0.5'>
              {rate.gt(0.00001) ?
                (`${utils_1.formatNumber.format(rate.toNumber())} ${toTokenInfo.symbol}`)
                : (<>
                    <PrecisionTickSize_1.default value={rate.toNumber()} maxSuffix={6}/> {toTokenInfo.symbol}
                  </>)}
            </div>
          </>) : (<>
            1 {toTokenInfo.symbol} ≈
            <div className='flex ml-0.5'>

              {rate.gt(0.00001) ?
                (`${utils_1.formatNumber.format(rate.toNumber())} ${fromTokenInfo.symbol}`)
                : (<>
                    <PrecisionTickSize_1.default value={rate.toNumber()} maxSuffix={6}/> {fromTokenInfo.symbol}
                  </>)}
            </div>
          </>)}
      </span>
      {reversible ? (<div className={'ml-2'}>
          <ApproxSVG />
        </div>) : null}
    </div>);
};
exports.default = ExchangeRate;
