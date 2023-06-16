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
const react_1 = __importStar(require("react"));
const Form_1 = __importDefault(require("../../components/Form"));
const FormPairSelector_1 = __importDefault(require("../../components/FormPairSelector"));
const accounts_1 = require("../../contexts/accounts");
const TokenContextProvider_1 = require("../../contexts/TokenContextProvider");
const WalletModal_1 = require("src/components/WalletComponents/components/WalletModal");
const SwapContext_1 = require("src/contexts/SwapContext");
const ScreenProvider_1 = require("src/contexts/ScreenProvider");
const WalletPassthroughProvider_1 = require("src/contexts/WalletPassthroughProvider");
const RouteSelectionScreen_1 = __importDefault(require("./RouteSelectionScreen"));
const UnknownTokenModal_1 = __importDefault(require("../UnknownTokenModal/UnknownTokenModal"));
const StakeModeSettings_1 = __importDefault(require("../StakeModeSettings"));
const DelegationStrategy_1 = __importDefault(require("../DelegationStrategy"));
const InitialScreen = ({ setShowStakeModeSettings, setIsWalletModalOpen, isWalletModalOpen, showStakeModeSettings, setShowDelegationStrategy, showDelegationStrategy }) => {
    const { wallet } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const { accounts } = (0, accounts_1.useAccounts)();
    const { tokenMap } = (0, TokenContextProvider_1.useTokenContext)();
    const { form, setForm, setErrors, selectedSwapRoute, formProps: { initialOutputMint, fixedOutputMint }, jupiter: { loading }, } = (0, SwapContext_1.useSwapContext)();
    const { setScreen } = (0, ScreenProvider_1.useScreenState)();
    const walletPublicKey = (0, react_1.useMemo)(() => { var _a; return (_a = wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey) === null || _a === void 0 ? void 0 : _a.toString(); }, [wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey]);
    const balance = (0, react_1.useMemo)(() => {
        var _a;
        return form.fromMint ? ((_a = accounts[form.fromMint]) === null || _a === void 0 ? void 0 : _a.balance) || 0 : 0;
    }, [walletPublicKey, accounts, form.fromMint]);
    const [isDisabled, setIsDisabled] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!form.fromValue || !form.fromMint || !form.toMint || !form.toValue || !selectedSwapRoute || loading) {
            setErrors({});
            setIsDisabled(true);
            return;
        }
        if (Number(form.fromValue) > balance) {
            setErrors({
                fromValue: { title: 'Insufficient balance', message: '' },
            });
            setIsDisabled(true);
            return;
        }
        setErrors({});
        setIsDisabled(false);
    }, [form, balance]);
    const [selectPairSelector, setSelectPairSelector] = (0, react_1.useState)(null);
    const [showRouteSelector, setShowRouteSelector] = (0, react_1.useState)(false);
    const [showUnknownToken, setShowUnknownToken] = (0, react_1.useState)(null);
    const onSelectMint = (0, react_1.useCallback)((tokenInfo, approved = false) => {
        var _a;
        const isUnknown = ((_a = tokenInfo.tags) === null || _a === void 0 ? void 0 : _a.length) === 0;
        if (isUnknown && approved === false) {
            setShowUnknownToken(tokenInfo);
            return;
        }
        if (selectPairSelector === 'fromMint') {
            setForm((prev) => (Object.assign(Object.assign(Object.assign({}, prev), { fromMint: tokenInfo.address, fromValue: '' }), (prev.toMint === tokenInfo.address ? { toMint: prev.fromMint } : undefined))));
        }
        else {
            setForm((prev) => (Object.assign(Object.assign(Object.assign({}, prev), { toMint: tokenInfo.address, toValue: '' }), (prev.fromMint === tokenInfo.address ? { fromMint: prev.toMint } : undefined))));
        }
        setSelectPairSelector(null);
    }, [selectPairSelector]);
    const availableMints = (0, react_1.useMemo)(() => {
        let result = [...tokenMap.values()];
        // On fixedOutputMint, prevent user from selecting the same token as output
        if (fixedOutputMint) {
            result = result.filter((item) => item.address !== initialOutputMint);
        }
        return result;
    }, [tokenMap, fixedOutputMint, initialOutputMint]);
    const onSubmitToConfirmation = (0, react_1.useCallback)(() => {
        setScreen('Confirmation');
    }, []);
    return (<>
      {/* Body */}
      <form onSubmit={onSubmitToConfirmation}>
        <Form_1.default onSubmit={onSubmitToConfirmation} isDisabled={isDisabled} setSelectPairSelector={setSelectPairSelector} setIsWalletModalOpen={setIsWalletModalOpen} setShowRouteSelector={setShowRouteSelector}/>
      </form>

      {showDelegationStrategy ? (<div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <DelegationStrategy_1.default onSubmit={() => { }} tokenInfos={[...tokenMap.values()]} onClose={() => setShowDelegationStrategy(false)}/>
        </div>) : null}

      {showStakeModeSettings ? (<div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <StakeModeSettings_1.default onSubmit={() => { }} tokenInfos={[...tokenMap.values()]} onClose={() => setShowStakeModeSettings(false)}/>
        </div>) : null}

      {selectPairSelector !== null ? (<div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <FormPairSelector_1.default onSubmit={onSelectMint} tokenInfos={availableMints} onClose={() => setSelectPairSelector(null)}/>
        </div>) : null}

      {showRouteSelector ? (<div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <RouteSelectionScreen_1.default onClose={() => setShowRouteSelector(false)}/>
        </div>) : null}

      {isWalletModalOpen ? (<div className="absolute top-0 right-0 h-full w-full bg-jupiter-bg rounded-lg overflow-hidden">
          <WalletModal_1.WalletModal setIsWalletModalOpen={setIsWalletModalOpen}/>
        </div>) : null}

      {showUnknownToken ? (<div className="absolute h-full w-full flex justify-center items-center bg-black/50 rounded-lg overflow-hidden">
          <UnknownTokenModal_1.default tokensInfo={[showUnknownToken]} onClickAccept={() => {
                onSelectMint(showUnknownToken, true);
                setShowUnknownToken(null);
            }} onClickReject={() => setShowUnknownToken(null)}/>
        </div>) : null}
    </>);
};
exports.default = InitialScreen;
