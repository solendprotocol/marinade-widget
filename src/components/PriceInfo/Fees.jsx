"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const utils_1 = require("src/misc/utils");
const TokenContextProvider_1 = require("src/contexts/TokenContextProvider");
const Fees = ({ marketInfos }) => {
    const { tokenMap } = (0, TokenContextProvider_1.useTokenContext)();
    if (!marketInfos || (marketInfos && marketInfos.length === 0)) {
        return null;
    }
    return (<>
      {marketInfos.map((item, idx) => {
            var _a;
            const tokenMint = tokenMap.get(item.lpFee.mint);
            const decimals = (_a = tokenMint === null || tokenMint === void 0 ? void 0 : tokenMint.decimals) !== null && _a !== void 0 ? _a : 6;
            const feeAmount = utils_1.formatNumber.format(new decimal_js_1.default(item.lpFee.amount.toString()).div(Math.pow(10, decimals)).toNumber());
            return (<div key={idx} className="flex items-center space-x-4 justify-between text-xs">
            <div className="text-[#4A5568]/30">
              <span>
                <span>
                  Fees paid to <span translate="no">{item.label}</span> LP
                </span>
              </span>
            </div>
            <div className="text-[#4A5568]/30 text-right">
              {feeAmount} {tokenMint === null || tokenMint === void 0 ? void 0 : tokenMint.symbol} ({utils_1.formatNumber.format(new decimal_js_1.default(item.lpFee.pct).mul(100).toNumber())}
              %)
            </div>
          </div>);
        })}
    </>);
};
exports.default = Fees;
