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
exports.getMarketName = void 0;
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importStar(require("react"));
const TokenContextProvider_1 = require("../contexts/TokenContextProvider");
const utils_1 = require("../misc/utils");
const TowardSVG = () => {
    const fill = 'rgba(0, 0, 0, 0.5)';
    return (<svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.112 3.328V2.38H6.016V0.892L9.388 2.848L6.016 4.816V3.328H0.112Z" fill={fill}/>
    </svg>);
};
const MARKET_LABEL_MAP = {
    'Orca (Whirlpools)': 'Orca',
};
const getMarketName = (markets) => {
    const names = [];
    markets.forEach((market) => {
        let label = '';
        const found = Object.keys(MARKET_LABEL_MAP).find((key) => market.label.indexOf(key) >= 0);
        if (found) {
            label = market.label.replaceAll(found, MARKET_LABEL_MAP[found]);
        }
        else {
            label = market.label;
        }
        names.push(label);
    });
    return names.join(' x ');
};
exports.getMarketName = getMarketName;
const SwapRoute = ({ route, toValue, toTokenInfo }) => {
    const { tokenMap } = (0, TokenContextProvider_1.useTokenContext)();
    const { name, path, amount } = (0, react_1.useMemo)(() => {
        var _a;
        return {
            name: (0, exports.getMarketName)(route.marketInfos),
            path: [
                ((_a = tokenMap.get(route.marketInfos[0].inputMint.toBase58())) === null || _a === void 0 ? void 0 : _a.symbol) || '',
                ...route.marketInfos
                    .map((info) => { var _a; return (_a = tokenMap.get(info.outputMint.toBase58())) === null || _a === void 0 ? void 0 : _a.symbol; })
                    .filter(Boolean),
            ],
            amount: Number(toValue),
        };
    }, [route, toValue, tokenMap]);
    const amountToRender = utils_1.formatNumber.format(amount, toTokenInfo.decimals);
    const mobileTextSize = (() => {
        const length = amountToRender.length;
        if (length >= 12)
            return 'text-xs';
        return 'text-md';
    })();
    return (<div style={{
            height: 'unset',
            backgroundImage: 'linear-gradient(96.8deg, rgba(250, 164, 58, 1) 4.71%, rgba(113, 229, 237, 1) 87.84%)',
        }} className={`cursor-pointer relative w-full rounded-lg p-0.5 mb-2 leading-tight`} translate="no">
      <div className={(0, classnames_1.default)({
            'flex items-center justify-between p-4 rounded-lg dark:text-[#4A5568] dark:border-transparent text-[13px] bg-white/80 dark:bg-[rgba(62,62,69,0.9)]': true,
        })}>
        <div className={'w-auto'}>
          <div className={(0, classnames_1.default)('flex items-center font-semibold')}>
            <span>{name}</span>
          </div>

          <div className="flex space-x-1">
            {path.map((item, idx) => (<div className="flex space-x-1 text-black/50 dark:text-[#4A5568]/50" key={idx}>
                <div className="font-semibold text-[11px]">
                  <span>{item}</span>
                </div>

                {idx < path.length - 1 && (<div className="flex items-center">
                    <TowardSVG />
                  </div>)}
              </div>))}
          </div>
        </div>

        <div className="text-right">
          <div className={(0, classnames_1.default)('font-semibold dark:text-[#4A5568] lg:text-md', mobileTextSize)}>{amountToRender}</div>
        </div>
      </div>
    </div>);
};
exports.default = SwapRoute;
