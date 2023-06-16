"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoConnectProvider = exports.useAutoConnect = exports.AutoConnectContext = void 0;
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const react_1 = require("react");
exports.AutoConnectContext = (0, react_1.createContext)({});
function useAutoConnect() {
    return (0, react_1.useContext)(exports.AutoConnectContext);
}
exports.useAutoConnect = useAutoConnect;
const AutoConnectProvider = ({ children }) => {
    const [autoConnect, setAutoConnect] = (0, wallet_adapter_react_1.useLocalStorage)('autoConnect', true);
    return <exports.AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>{children}</exports.AutoConnectContext.Provider>;
};
exports.AutoConnectProvider = AutoConnectProvider;
