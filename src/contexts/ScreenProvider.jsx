"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenProvider = exports.useScreenState = exports.ScreenStateContext = void 0;
const react_1 = require("react");
exports.ScreenStateContext = (0, react_1.createContext)({ screen: 'Initial', setScreen() { }, setContext() { }, context: {} });
function useScreenState() {
    return (0, react_1.useContext)(exports.ScreenStateContext);
}
exports.useScreenState = useScreenState;
const ScreenProvider = ({ children }) => {
    const [screen, setScreen] = (0, react_1.useState)('Initial');
    const [context, setContext] = (0, react_1.useState)({});
    return <exports.ScreenStateContext.Provider value={{ screen, setScreen, context, setContext }}>{children}</exports.ScreenStateContext.Provider>;
};
exports.ScreenProvider = ScreenProvider;
