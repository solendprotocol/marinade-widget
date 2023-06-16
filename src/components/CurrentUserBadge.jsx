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
exports.CurrentUserBadge = void 0;
const react_1 = __importStar(require("react"));
const constants_1 = require("src/constants");
const accounts_1 = require("src/contexts/accounts");
const WalletPassthroughProvider_1 = require("src/contexts/WalletPassthroughProvider");
const utils_1 = require("../misc/utils");
const CurrentUserBadge = () => {
    var _a;
    const { publicKey, wallet } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const { accounts } = (0, accounts_1.useAccounts)();
    const solBalance = (0, react_1.useMemo)(() => {
        if (accounts[constants_1.WRAPPED_SOL_MINT.toString()]) {
            return accounts[constants_1.WRAPPED_SOL_MINT.toString()].balance;
        }
        return 0;
    }, [publicKey, accounts]);
    if (!wallet || !publicKey) {
        return null;
    }
    return (<div className="flex items-center bg-[#EDF2F7] py-2 px-3 rounded-lg h-7">
      <div className="w-4 h-4 rounded-full bg-[#EDF2F7] dark:bg-white-10 flex justify-center items-center" style={{ position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Wallet logo" width={16} height={16} src={(_a = wallet === null || wallet === void 0 ? void 0 : wallet.adapter) === null || _a === void 0 ? void 0 : _a.icon}/>
      </div>

      <div className="ml-2">
        <div className="text-xs text-[#4A5568]">{(0, utils_1.shortenAddress)(`${publicKey}`)}</div>
      </div>
    </div>);
};
exports.CurrentUserBadge = CurrentUserBadge;
