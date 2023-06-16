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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccounts = exports.AccountsProvider = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const spl_token_1 = require("@solana/spl-token");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const react_1 = __importStar(require("react"));
const WalletPassthroughProvider_1 = require("./WalletPassthroughProvider");
const constants_1 = require("src/constants");
const utils_1 = require("src/misc/utils");
const AccountContext = react_1.default.createContext({
    accounts: {},
    loading: true,
    refresh: () => { },
});
const AccountsProvider = ({ children }) => {
    const { publicKey, connected } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [accounts, setAccounts] = (0, react_1.useState)({});
    const fetchNative = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!publicKey || !connected)
            return null;
        const response = yield connection.getAccountInfo(publicKey);
        if (response) {
            return {
                balance: (0, utils_1.fromLamports)((response === null || response === void 0 ? void 0 : response.lamports) || 0, 9),
                balanceLamports: new bn_js_1.default((response === null || response === void 0 ? void 0 : response.lamports) || 0),
                hasBalance: (response === null || response === void 0 ? void 0 : response.lamports) ? (response === null || response === void 0 ? void 0 : response.lamports) > 0 : false,
                decimals: 9,
            };
        }
    });
    const fetchAllTokens = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!publicKey || !connected)
            return {};
        const response = yield connection.getParsedTokenAccountsByOwner(publicKey, { programId: spl_token_1.TOKEN_PROGRAM_ID }, 'confirmed');
        const reducedResult = response.value.reduce((acc, item) => {
            acc[item.account.data.parsed.info.mint] = {
                balance: item.account.data.parsed.info.tokenAmount.uiAmount,
                balanceLamports: new bn_js_1.default(0),
                hasBalance: item.account.data.parsed.info.tokenAmount.uiAmount > 0,
                decimals: item.account.data.parsed.info.tokenAmount.decimals,
            };
            return acc;
        }, {});
        return reducedResult;
    });
    const refresh = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!publicKey) {
            setAccounts({});
            return;
        }
        // Fetch all tokens balance
        const [nativeAccount, accounts] = yield Promise.all([fetchNative(), fetchAllTokens()]);
        setAccounts(Object.assign(Object.assign({}, accounts), (nativeAccount ? { [constants_1.WRAPPED_SOL_MINT.toString()]: nativeAccount } : {})));
        setLoading(false);
    });
    // Fetch all accounts for the current wallet
    (0, react_1.useEffect)(() => {
        refresh();
    }, [publicKey, connected]);
    return <AccountContext.Provider value={{ accounts, loading, refresh }}>{children}</AccountContext.Provider>;
};
exports.AccountsProvider = AccountsProvider;
const useAccounts = () => {
    return (0, react_1.useContext)(AccountContext);
};
exports.useAccounts = useAccounts;
