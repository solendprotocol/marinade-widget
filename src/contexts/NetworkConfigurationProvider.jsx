"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkConfigurationProvider = exports.useNetworkConfiguration = exports.NetworkConfigurationContext = void 0;
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const react_1 = require("react");
exports.NetworkConfigurationContext = (0, react_1.createContext)({});
function useNetworkConfiguration() {
    return (0, react_1.useContext)(exports.NetworkConfigurationContext);
}
exports.useNetworkConfiguration = useNetworkConfiguration;
const NetworkConfigurationProvider = ({ children }) => {
    const [networkConfiguration, setNetworkConfiguration] = (0, wallet_adapter_react_1.useLocalStorage)('network', 'mainnet-beta');
    return (<exports.NetworkConfigurationContext.Provider value={{ networkConfiguration, setNetworkConfiguration }}>
      {children}
    </exports.NetworkConfigurationContext.Provider>);
};
exports.NetworkConfigurationProvider = NetworkConfigurationProvider;
