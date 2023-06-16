"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlippageConfigProvider = exports.useSlippageConfig = exports.SlippageConfigContext = exports.DEFAULT_SLIPPAGE = void 0;
const react_1 = require("react");
exports.DEFAULT_SLIPPAGE = 0.5;
exports.SlippageConfigContext = (0, react_1.createContext)({});
function useSlippageConfig() {
    return (0, react_1.useContext)(exports.SlippageConfigContext);
}
exports.useSlippageConfig = useSlippageConfig;
const SlippageConfigProvider = ({ children }) => {
    const [slippage, setSlippage] = (0, react_1.useState)(exports.DEFAULT_SLIPPAGE);
    return <exports.SlippageConfigContext.Provider value={{ slippage, setSlippage }}>{children}</exports.SlippageConfigContext.Provider>;
};
exports.SlippageConfigProvider = SlippageConfigProvider;
