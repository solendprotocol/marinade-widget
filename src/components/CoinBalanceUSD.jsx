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
const decimal_js_1 = __importDefault(require("decimal.js"));
const USDValueProvider_1 = require("src/contexts/USDValueProvider");
const utils_1 = require("src/misc/utils");
const CoinBalanceUSD = ({ tokenInfo, amount }) => {
    const { tokenPriceMap } = (0, USDValueProvider_1.useUSDValueProvider)();
    const amountInUSD = (0, react_1.useMemo)(() => {
        var _a;
        if (!amount || !(0, utils_1.hasNumericValue)(amount))
            return 0;
        const cgPrice = ((_a = tokenPriceMap[tokenInfo.address]) === null || _a === void 0 ? void 0 : _a.usd) || 0;
        return new decimal_js_1.default(amount || 0).mul(cgPrice).toNumber();
    }, [tokenPriceMap, amount]);
    return amountInUSD && amountInUSD > 0 ? <>${utils_1.formatNumber.format(amountInUSD, 2)}</> : <>{''}</>;
};
exports.default = CoinBalanceUSD;
