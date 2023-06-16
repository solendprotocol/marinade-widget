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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const react_1 = __importStar(require("react"));
const react_query_1 = require("@tanstack/react-query");
const ScreenProvider_1 = require("src/contexts/ScreenProvider");
const WalletPassthroughProvider_1 = require("src/contexts/WalletPassthroughProvider");
const USDValueProvider_1 = require("src/contexts/USDValueProvider");
const Header_1 = __importDefault(require("../components/Header"));
const accounts_1 = require("../contexts/accounts");
const InitialScreen_1 = __importDefault(require("./screens/InitialScreen"));
const SwappingScreen_1 = __importDefault(require("./screens/SwappingScreen"));
const Content = () => {
    const { screen } = (0, ScreenProvider_1.useScreenState)();
    const [isWalletModalOpen, setIsWalletModalOpen] = (0, react_1.useState)(false);
    const [showStakeModeSettings, setShowStakeModeSettings] = (0, react_1.useState)(false);
    const [showDelegationStrategy, setShowDelegationStrategy] = (0, react_1.useState)(false);
    return (<>
      {screen === 'Initial' ? (<>
          <Header_1.default setIsWalletModalOpen={setIsWalletModalOpen} setShowStakeModeSettings={setShowStakeModeSettings} setShowDelegationStrategy={setShowDelegationStrategy}/>
          <InitialScreen_1.default showStakeModeSettings={showStakeModeSettings} setShowStakeModeSettings={setShowStakeModeSettings} showDelegationStrategy={showDelegationStrategy} setShowDelegationStrategy={setShowDelegationStrategy} isWalletModalOpen={isWalletModalOpen} setIsWalletModalOpen={setIsWalletModalOpen}/>
        </>) : <SwappingScreen_1.default />}
    </>);
};
const queryClient = new react_query_1.QueryClient();
const JupiterApp = (props) => {
    const { displayMode, platformFeeAndAccounts, formProps, } = props;
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const { wallet } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const walletPublicKey = (0, react_1.useMemo)(() => wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey, [wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey]);
    const [asLegacyTransaction, setAsLegacyTransaction] = (0, react_1.useState)(true);
    // Auto detech if wallet supports it, and enable it if it does
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if ((_b = (_a = wallet === null || wallet === void 0 ? void 0 : wallet.adapter) === null || _a === void 0 ? void 0 : _a.supportedTransactionVersions) === null || _b === void 0 ? void 0 : _b.has(0)) {
            setAsLegacyTransaction(false);
            return;
        }
        setAsLegacyTransaction(true);
    }, [wallet === null || wallet === void 0 ? void 0 : wallet.adapter]);
    return (<react_query_1.QueryClientProvider client={queryClient}>
    <accounts_1.AccountsProvider>
      <USDValueProvider_1.USDValueProvider>
      <Content />
      </USDValueProvider_1.USDValueProvider>
      </accounts_1.AccountsProvider>
      </react_query_1.QueryClientProvider>);
};
exports.default = JupiterApp;
