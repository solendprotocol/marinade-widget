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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const WalletPassthroughProvider_1 = require("src/contexts/WalletPassthroughProvider");
const accounts_1 = require("../contexts/accounts");
const utils_1 = require("../misc/utils");
const CoinBalance = (props) => {
    const { accounts } = (0, accounts_1.useAccounts)();
    const { wallet } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const walletPublicKey = React.useMemo(() => { var _a; return (_a = wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey) === null || _a === void 0 ? void 0 : _a.toString(); }, [wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey]);
    const balance = React.useMemo(() => {
        var _a;
        return ((_a = accounts[props.mintAddress]) === null || _a === void 0 ? void 0 : _a.balance) || 0;
    }, [accounts, props.mintAddress]);
    if (props.hideZeroBalance && balance === 0)
        return null;
    if (!walletPublicKey)
        return <span translate="no">{utils_1.formatNumber.format(0, 6)}</span>;
    return <span translate="no">{utils_1.formatNumber.format(balance, 6)}</span>;
};
exports.default = CoinBalance;
