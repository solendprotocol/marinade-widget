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
const FormPairSelector_1 = require("./FormPairSelector");
const ValidatorRow_1 = require("./ValidatorRow");
const USDValueProvider_1 = require("src/contexts/USDValueProvider");
const decimal_js_1 = __importDefault(require("decimal.js"));
const spl_token_1 = require("@solana/spl-token");
const FormAccountRow = ({ item, style, onSubmit }) => {
    const { tokenPriceMap } = (0, USDValueProvider_1.useUSDValueProvider)();
    const totalUsdValue = (0, react_1.useMemo)(() => {
        var _a;
        const tokenPrice = (_a = tokenPriceMap[spl_token_1.NATIVE_MINT.toString()]) === null || _a === void 0 ? void 0 : _a.usd;
        if (!tokenPrice)
            return null;
        const totalAValue = new decimal_js_1.default(tokenPrice).mul(item.balance);
        return totalAValue;
    }, [item, tokenPriceMap]);
    return (<li className={`cursor-pointer list-none `} style={Object.assign(Object.assign({ maxHeight: FormPairSelector_1.PAIR_ROW_HEIGHT, height: FormPairSelector_1.PAIR_ROW_HEIGHT }, style), { right: 0 })} translate="no">
      <div className="flex items-center rounded-lg space-x-4 my-2 p-3 justify-between hover:bg-black/10" onClick={() => onSubmit(item)}>
        <div className="flex-shrink-0">
          <div className="h-6 w-6 rounded-full" style={{
            background: item.background
        }}/>
        </div>

        <div className="flex-1 min-w-0">
          <div className='flex flex-row space-x-2'>
            <p className="text-sm font-bold text-[#4A5568] truncate">
              {(0, ValidatorRow_1.formatAddress)(item.address)}
            </p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate flex space-x-1">
            Stake account: {(0, ValidatorRow_1.formatAddress)(item.address)}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className='flex flex-row space-x-2'>
            <p className="text-sm font-bold text-[#4A5568] truncate">
              {item.balance} SOL
            </p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate space-x-1">
          {totalUsdValue && totalUsdValue.gt(0.01) ? (<span className='ml-1'>
              ${totalUsdValue.toFixed(2)}
            </span>) : null}
          </div>
        </div>
      </div>
    </li>);
};
exports.default = FormAccountRow;
