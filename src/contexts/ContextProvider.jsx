"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextProvider = void 0;
const react_1 = __importDefault(require("react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const web3_js_1 = require("@solana/web3.js");
const react_2 = require("react");
const AutoConnectProvider_1 = require("./AutoConnectProvider");
const NetworkConfigurationProvider_1 = require("./NetworkConfigurationProvider");
// Built in wallets
const wallet_adapter_phantom_1 = require("@solana/wallet-adapter-phantom");
const wallet_adapter_solflare_1 = require("@solana/wallet-adapter-solflare");
const wallet_adapter_backpack_1 = require("@solana/wallet-adapter-backpack");
const wallet_adapter_glow_1 = require("@solana/wallet-adapter-glow");
const preferredExplorer_1 = require("./preferredExplorer");
const WalletContextProvider = ({ endpoint, children }) => {
    const { autoConnect } = (0, AutoConnectProvider_1.useAutoConnect)();
    const { networkConfiguration } = (0, NetworkConfigurationProvider_1.useNetworkConfiguration)();
    const network = networkConfiguration;
    const selectedEndpoint = (0, react_2.useMemo)(() => endpoint !== null && endpoint !== void 0 ? endpoint : (0, web3_js_1.clusterApiUrl)(network), [network]);
    const passThroughWallet = (() => {
        if (typeof window === 'undefined')
            return undefined;
        return window.Jupiter.passThroughWallet;
    })();
    const wallets = (0, react_2.useMemo)(() => {
        if (passThroughWallet) {
            return [];
        }
        return [
            new wallet_adapter_phantom_1.PhantomWalletAdapter(),
            new wallet_adapter_solflare_1.SolflareWalletAdapter(),
            new wallet_adapter_backpack_1.BackpackWalletAdapter(),
            new wallet_adapter_glow_1.GlowWalletAdapter(),
        ];
    }, [network]);
    const onError = (0, react_2.useCallback)((error) => {
        console.error({ type: 'error', message: error.message ? `${error.name}: ${error.message}` : error.name });
    }, []);
    return (<wallet_adapter_react_1.ConnectionProvider endpoint={selectedEndpoint}>
      <wallet_adapter_react_1.WalletProvider wallets={wallets} onError={onError} autoConnect={autoConnect}>
        {children}
      </wallet_adapter_react_1.WalletProvider>
    </wallet_adapter_react_1.ConnectionProvider>);
};
const ContextProvider = ({ endpoint, defaultExplorer, children }) => {
    return (<>
      <NetworkConfigurationProvider_1.NetworkConfigurationProvider>
        <AutoConnectProvider_1.AutoConnectProvider>
          <WalletContextProvider endpoint={endpoint}>
            <preferredExplorer_1.PreferredExplorerProvider defaultExplorer={defaultExplorer}>
              {children}
            </preferredExplorer_1.PreferredExplorerProvider>
          </WalletContextProvider>
        </AutoConnectProvider_1.AutoConnectProvider>
      </NetworkConfigurationProvider_1.NetworkConfigurationProvider>
    </>);
};
exports.ContextProvider = ContextProvider;
