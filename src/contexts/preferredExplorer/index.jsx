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
exports.usePreferredExplorer = exports.PreferredExplorerProvider = exports.AVAILABLE_EXPLORER = void 0;
const react_1 = __importStar(require("react"));
exports.AVAILABLE_EXPLORER = [
    {
        name: 'Solana Explorer',
        url: 'https://explorer.solana.com/',
        get: (txid, cluster = 'mainnet-beta') => {
            if (cluster !== 'mainnet-beta')
                return `https://explorer.solana.com/tx/${txid}?cluster=${cluster}`;
            return `https://explorer.solana.com/tx/${txid}`;
        },
        getToken: (mint, cluster = 'mainnet-beta') => {
            if (cluster !== 'mainnet-beta')
                return `https://explorer.solana.com/address/${mint}?cluster=${cluster}`;
            return `https://explorer.solana.com/address/${mint}`;
        },
    },
    {
        name: 'Solscan',
        url: 'https://solscan.io/',
        get: (txid, cluster = 'mainnet-beta') => {
            if (cluster !== 'mainnet-beta')
                return `https://solscan.io/tx/${txid}?cluster=${cluster}`;
            return `https://solscan.io/tx/${txid}`;
        },
        getToken: (mint, cluster = 'mainnet-beta') => {
            if (cluster !== 'mainnet-beta')
                return `https://solscan.io/token/${mint}?cluster=${cluster}`;
            return `https://solscan.io/token/${mint}`;
        },
    },
    {
        name: 'Solana Beach',
        url: 'https://solanabeach.io/',
        get: (txid, cluster = 'mainnet-beta') => {
            if (cluster !== 'mainnet-beta')
                return `https://solanabeach.io/transaction/${txid}?cluster=${cluster}`;
            return `https://solanabeach.io/transaction/${txid}`;
        },
        getToken: (mint, cluster = 'mainnet-beta') => {
            if (cluster !== 'mainnet-beta')
                return `https://solanabeach.io/address/${mint}?cluster=${cluster}`;
            return `https://solanabeach.io/address/${mint}`;
        },
    },
    {
        name: 'SolanaFM',
        url: 'https://solana.fm/',
        get: (txid, cluster = 'mainnet-beta') => {
            if (cluster === 'devnet')
                return `https://solana.fm/tx/${txid}?cluster=devnet-solana`;
            if (cluster === 'testnet')
                return `https://solana.fm/tx/${txid}?cluster=testnet-qn1`;
            return `https://solana.fm/tx/${txid}`;
        },
        getToken: (mint, cluster = 'mainnet-beta') => {
            if (cluster === 'devnet')
                return `https://solana.fm/address/${mint}?cluster=devnet-solana`;
            if (cluster === 'testnet')
                return `https://solana.fm/address/${mint}?cluster=testnet-qn1`;
            return `https://solana.fm/address/${mint}`;
        },
    },
];
const PreferredExplorerContext = (0, react_1.createContext)({
    explorer: exports.AVAILABLE_EXPLORER[0].name,
    getExplorer: (txid, cluster) => '',
    getTokenExplorer: (mint, cluster) => '',
    setExplorer: (explorer) => { },
});
const PreferredExplorerProvider = ({ defaultExplorer, children, }) => {
    const [explorer, setExplorer] = (0, react_1.useState)(defaultExplorer !== null && defaultExplorer !== void 0 ? defaultExplorer : exports.AVAILABLE_EXPLORER[0].name);
    const explorerObject = (0, react_1.useMemo)(() => {
        return exports.AVAILABLE_EXPLORER.find((e) => e.name === explorer) || exports.AVAILABLE_EXPLORER[0];
    }, [explorer]);
    const getExplorer = (0, react_1.useCallback)((txid, cluster) => explorerObject.get(txid, cluster), [explorerObject]);
    const getTokenExplorer = (0, react_1.useCallback)((mint, cluster) => explorerObject.getToken(mint, cluster), [explorerObject]);
    return (<PreferredExplorerContext.Provider value={{ explorer, getExplorer, getTokenExplorer, setExplorer: (explorer) => setExplorer(explorer) }}>
      {children}
    </PreferredExplorerContext.Provider>);
};
exports.PreferredExplorerProvider = PreferredExplorerProvider;
function usePreferredExplorer() {
    const context = (0, react_1.useContext)(PreferredExplorerContext);
    return context;
}
exports.usePreferredExplorer = usePreferredExplorer;
