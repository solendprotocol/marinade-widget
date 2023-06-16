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
exports.useTokenContext = exports.TokenContextProvider = exports.CLUSTER_TO_CHAIN_ID = void 0;
const react_1 = __importStar(require("react"));
const spl_token_registry_1 = require("@solana/spl-token-registry");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
exports.CLUSTER_TO_CHAIN_ID = {
    'mainnet-beta': spl_token_registry_1.ENV.MainnetBeta,
    testnet: spl_token_registry_1.ENV.Testnet,
    devnet: spl_token_registry_1.ENV.Devnet,
    localnet: spl_token_registry_1.ENV.Devnet,
};
const TokenContext = react_1.default.createContext({
    tokenMap: new Map(),
    isLoaded: false,
    preferredTokenListMode: 'strict',
    setPreferredTokenListMode() { },
});
const fetchAllMints = (env, preferredTokenListMode) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield (preferredTokenListMode === 'strict' ? yield fetch('https://token.jup.ag/strict') : yield fetch('https://token.jup.ag/all')).json();
    const res = new spl_token_registry_1.TokenListContainer(tokens);
    const list = res.filterByChainId(exports.CLUSTER_TO_CHAIN_ID[env]).getList();
    return list.reduce((acc, item) => {
        acc.set(item.address, item);
        return acc;
    }, new Map());
});
function TokenContextProvider({ strictTokenList, children }) {
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const defaultPreferredTokenListMode = (0, react_1.useMemo)(() => {
        if (typeof strictTokenList === 'undefined')
            return 'strict';
        return strictTokenList ? 'strict' : 'all';
    }, [strictTokenList]);
    const [preferredTokenListMode, setPreferredTokenListMode] = (0, react_1.useState)(defaultPreferredTokenListMode);
    const [{ tokenMap, isLoaded }, setState] = (0, react_1.useState)({
        isLoaded: false,
        tokenMap: new Map(),
    });
    const cluster = 'mainnet-beta';
    (0, react_1.useEffect)(() => {
        fetchAllMints(cluster, preferredTokenListMode).then((tokenMap) => __awaiter(this, void 0, void 0, function* () {
            setState({
                isLoaded: true,
                tokenMap,
            });
        }));
    }, [connection, preferredTokenListMode]);
    return (<TokenContext.Provider value={{ tokenMap, isLoaded, preferredTokenListMode, setPreferredTokenListMode }}>
      {children}
    </TokenContext.Provider>);
}
exports.TokenContextProvider = TokenContextProvider;
function useTokenContext() {
    const context = (0, react_1.useContext)(TokenContext);
    if (!context) {
        throw new Error('TokenContext not found');
    }
    return context;
}
exports.useTokenContext = useTokenContext;
