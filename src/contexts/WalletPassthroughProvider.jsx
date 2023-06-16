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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWalletPassThrough = exports.WalletPassthroughContext = void 0;
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const react_1 = __importStar(require("react"));
const initialPassThrough = {
    publicKey: null,
    wallets: [],
    wallet: null,
    connect: () => __awaiter(void 0, void 0, void 0, function* () { }),
    select: () => { },
    connecting: false,
    connected: false,
    disconnect: () => __awaiter(void 0, void 0, void 0, function* () { }),
};
exports.WalletPassthroughContext = (0, react_1.createContext)(initialPassThrough);
function useWalletPassThrough() {
    return (0, react_1.useContext)(exports.WalletPassthroughContext);
}
exports.useWalletPassThrough = useWalletPassThrough;
const WalletPassthroughProvider = ({ children }) => {
    const { publicKey, wallets, wallet, connect, select, connecting, connected, disconnect } = (0, wallet_adapter_react_1.useWallet)();
    const value = (() => {
        // Pass through wallet adapter
        const passThroughWallet = window.Jupiter.passThroughWallet;
        if (Boolean(passThroughWallet) && (passThroughWallet === null || passThroughWallet === void 0 ? void 0 : passThroughWallet.adapter.publicKey)) {
            return Object.assign(Object.assign({}, initialPassThrough), { publicKey: passThroughWallet === null || passThroughWallet === void 0 ? void 0 : passThroughWallet.adapter.publicKey, wallet: {
                    adapter: passThroughWallet.adapter,
                    readyState: wallet_adapter_base_1.WalletReadyState.Loadable,
                }, connecting: false, connected: true, disconnect: () => __awaiter(void 0, void 0, void 0, function* () {
                    try {
                        if (passThroughWallet === null || passThroughWallet === void 0 ? void 0 : passThroughWallet.adapter.disconnect) {
                            return passThroughWallet === null || passThroughWallet === void 0 ? void 0 : passThroughWallet.adapter.disconnect();
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }) });
        }
        // Original wallet adapter
        return {
            publicKey,
            wallets,
            wallet,
            connect,
            select,
            connecting,
            connected,
            disconnect,
        };
    })();
    return <exports.WalletPassthroughContext.Provider value={value}>{children}</exports.WalletPassthroughContext.Provider>;
};
exports.default = WalletPassthroughProvider;
