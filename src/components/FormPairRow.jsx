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
const Coinbalance_1 = __importDefault(require("./Coinbalance"));
const FormPairSelector_1 = require("./FormPairSelector");
const TokenIcon_1 = __importDefault(require("./TokenIcon"));
const USDValueProvider_1 = require("src/contexts/USDValueProvider");
const decimal_js_1 = __importDefault(require("decimal.js"));
const accounts_1 = require("src/contexts/accounts");
const FormPairRow = ({ item, style, onSubmit }) => {
    const { accounts } = (0, accounts_1.useAccounts)();
    const { tokenPriceMap } = (0, USDValueProvider_1.useUSDValueProvider)();
    const totalUsdValue = (0, react_1.useMemo)(() => {
        const totalAValue = new decimal_js_1.default(1);
        return totalAValue;
    }, [accounts, tokenPriceMap]);
    return (<li className={`cursor-pointer list-none `} style={Object.assign(Object.assign({ maxHeight: FormPairSelector_1.PAIR_ROW_HEIGHT, height: FormPairSelector_1.PAIR_ROW_HEIGHT }, style), { right: 0 })} translate="no">
      <div className="flex items-center rounded-lg space-x-4 my-2 p-3 justify-between hover:bg-black/10" onClick={() => onSubmit(item)}>
        <div className="flex-shrink-0">
          <div className="h-6 w-6 rounded-full">
            <TokenIcon_1.default tokenInfo={item} width={24} height={24}/>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className='flex flex-row space-x-2'>
            <p className="text-sm font-bold text-[#4A5568] truncate">
              {item.symbol}
            </p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate flex space-x-1">
            {item.name}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className='flex flex-row space-x-2'>
            <p className="text-sm font-bold text-[#4A5568] truncate">
              <Coinbalance_1.default mintAddress={item.address}/>
            </p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate space-x-1">
            ${item.decimals}.00
          </div>
        </div>
      </div>
    </li>);
};
exports.default = FormPairRow;
