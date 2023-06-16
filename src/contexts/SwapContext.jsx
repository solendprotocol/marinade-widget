"use strict";
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
exports.SwapContextProvider = exports.PRIORITY_MAXIMUM_SUGGESTED = exports.PRIORITY_TURBO = exports.PRIORITY_HIGH = exports.PRIORITY_NONE = exports.useSwapContext = exports.SwapContext = exports.initialSwapContext = void 0;
const math_1 = require("@jup-ag/math");
const react_hook_1 = require("@jup-ag/react-hook");
const web3_js_1 = require("@solana/web3.js");
const decimal_js_1 = __importDefault(require("decimal.js"));
const jsbi_1 = __importDefault(require("jsbi"));
const react_1 = require("react");
const constants_1 = require("src/constants");
const utils_1 = require("src/misc/utils");
const accounts_1 = require("./accounts");
const SlippageConfigProvider_1 = require("./SlippageConfigProvider");
const TokenContextProvider_1 = require("./TokenContextProvider");
const WalletPassthroughProvider_1 = require("./WalletPassthroughProvider");
exports.initialSwapContext = {
    form: {
        fromMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        toMint: constants_1.WRAPPED_SOL_MINT.toString(),
        fromValue: '',
        toValue: '',
    },
    setForm() { },
    errors: {},
    setErrors() { },
    fromTokenInfo: undefined,
    toTokenInfo: undefined,
    selectedSwapRoute: null,
    setSelectedSwapRoute() { },
    onSubmit: () => __awaiter(void 0, void 0, void 0, function* () { return null; }),
    lastSwapResult: null,
    displayMode: 'modal',
    formProps: {
        swapMode: react_hook_1.SwapMode.ExactIn,
        initialAmount: undefined,
        fixedAmount: undefined,
        initialInputMint: undefined,
        fixedInputMint: undefined,
        initialOutputMint: undefined,
        fixedOutputMint: undefined,
    },
    scriptDomain: '',
    swapping: {
        totalTxs: 0,
        txStatus: [],
    },
    reset() { },
    jupiter: {
        routes: [],
        allTokenMints: [],
        routeMap: new Map(),
        exchange: undefined,
        loading: false,
        refresh() { },
        lastRefreshTimestamp: 0,
        error: undefined,
        asLegacyTransaction: false,
        setAsLegacyTransaction() { },
        priorityFeeInSOL: 0,
        setPriorityFeeInSOL() { },
    },
};
exports.SwapContext = (0, react_1.createContext)(exports.initialSwapContext);
function useSwapContext() {
    return (0, react_1.useContext)(exports.SwapContext);
}
exports.useSwapContext = useSwapContext;
exports.PRIORITY_NONE = 0; // No additional fee
exports.PRIORITY_HIGH = 0.000005; // Additional fee of 1x base fee
exports.PRIORITY_TURBO = 0.0005; // Additional fee of 100x base fee
exports.PRIORITY_MAXIMUM_SUGGESTED = 0.01;
const SwapContextProvider = (props) => {
    var _a, _b;
    const { displayMode, scriptDomain, asLegacyTransaction, setAsLegacyTransaction, formProps: originalFormProps, children, } = props;
    const { tokenMap } = (0, TokenContextProvider_1.useTokenContext)();
    const { wallet } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const { refresh: refreshAccount } = (0, accounts_1.useAccounts)();
    const walletPublicKey = (0, react_1.useMemo)(() => { var _a; return (_a = wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey) === null || _a === void 0 ? void 0 : _a.toString(); }, [wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey]);
    const formProps = (0, react_1.useMemo)(() => (Object.assign(Object.assign({}, exports.initialSwapContext.formProps), originalFormProps)), [originalFormProps]);
    const [form, setForm] = (0, react_1.useState)({
        fromMint: (_a = formProps === null || formProps === void 0 ? void 0 : formProps.initialInputMint) !== null && _a !== void 0 ? _a : 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        toMint: (_b = formProps === null || formProps === void 0 ? void 0 : formProps.initialOutputMint) !== null && _b !== void 0 ? _b : constants_1.WRAPPED_SOL_MINT.toString(),
        fromValue: '',
        toValue: '',
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const jupiterSwapMode = (0, react_1.useMemo)(() => (formProps === null || formProps === void 0 ? void 0 : formProps.swapMode) ? react_hook_1.SwapMode[formProps === null || formProps === void 0 ? void 0 : formProps.swapMode] : react_hook_1.SwapMode.ExactIn, [formProps === null || formProps === void 0 ? void 0 : formProps.swapMode]);
    const fromTokenInfo = (0, react_1.useMemo)(() => {
        const tokenInfo = form.fromMint ? tokenMap.get(form.fromMint) : null;
        return tokenInfo;
    }, [form.fromMint, tokenMap]);
    const toTokenInfo = (0, react_1.useMemo)(() => {
        const tokenInfo = form.toMint ? tokenMap.get(form.toMint) : null;
        return tokenInfo;
    }, [form.toMint, tokenMap]);
    // Set value given initial amount
    const setupInitialAmount = (0, react_1.useCallback)(() => {
        if (!(formProps === null || formProps === void 0 ? void 0 : formProps.initialAmount) || tokenMap.size === 0 || !fromTokenInfo || !toTokenInfo)
            return;
        const toUiAmount = (mint) => {
            var _a;
            const tokenInfo = mint ? tokenMap.get(mint) : undefined;
            if (!tokenInfo)
                return;
            return String((0, utils_1.fromLamports)(jsbi_1.default.BigInt((_a = formProps.initialAmount) !== null && _a !== void 0 ? _a : 0), tokenInfo.decimals));
        };
        if (jupiterSwapMode === react_hook_1.SwapMode.ExactOut) {
            setForm((prev) => {
                var _a;
                return Object.assign(Object.assign({}, prev), { toValue: (_a = toUiAmount(prev.toMint)) !== null && _a !== void 0 ? _a : '' });
            });
        }
        else {
            setForm((prev) => { var _a; return (Object.assign(Object.assign({}, prev), { fromValue: (_a = toUiAmount(prev.fromMint)) !== null && _a !== void 0 ? _a : '' })); });
        }
    }, [formProps === null || formProps === void 0 ? void 0 : formProps.initialAmount, jupiterSwapMode, tokenMap]);
    (0, react_1.useEffect)(() => {
        setupInitialAmount();
    }, [formProps === null || formProps === void 0 ? void 0 : formProps.initialAmount, jupiterSwapMode, tokenMap]);
    const nativeAmount = (0, react_1.useMemo)(() => {
        if (jupiterSwapMode === react_hook_1.SwapMode.ExactOut) {
            if (!form.toValue || !toTokenInfo)
                return jsbi_1.default.BigInt(0);
            return (0, utils_1.toLamports)(Number(form.toValue), Number(toTokenInfo.decimals));
        }
        else {
            if (!form.fromValue || !fromTokenInfo)
                return jsbi_1.default.BigInt(0);
            return (0, utils_1.toLamports)(Number(form.fromValue), Number(fromTokenInfo.decimals));
        }
    }, [form.fromValue, form.fromMint, fromTokenInfo, form.toValue, form.toMint, toTokenInfo, jupiterSwapMode]);
    const { slippage } = (0, SlippageConfigProvider_1.useSlippageConfig)();
    const amount = jsbi_1.default.BigInt(nativeAmount);
    const { routes: swapRoutes, allTokenMints, routeMap, exchange, loading: loadingQuotes, refresh, lastRefreshTimestamp, error, } = (0, react_hook_1.useJupiter)({
        amount,
        inputMint: (0, react_1.useMemo)(() => form.fromMint ? new web3_js_1.PublicKey(form.fromMint) : web3_js_1.PublicKey.default, [form.fromMint]),
        outputMint: (0, react_1.useMemo)(() => form.toMint ? new web3_js_1.PublicKey(form.toMint) : web3_js_1.PublicKey.default, [form.toMint]),
        swapMode: jupiterSwapMode,
        slippageBps: Math.ceil(slippage * 100),
        asLegacyTransaction,
    });
    // Refresh on slippage change
    (0, react_1.useEffect)(() => refresh(), [slippage]);
    const [selectedSwapRoute, setSelectedSwapRoute] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!swapRoutes || swapRoutes.length === 0) {
            setSelectedSwapRoute(null);
            return;
        }
        // the UI sorts the best route depending on ExactIn or ExactOut
        setSelectedSwapRoute(swapRoutes[0]);
    }, [jupiterSwapMode, swapRoutes]);
    (0, react_1.useEffect)(() => {
        setForm((prev) => {
            const newValue = Object.assign({}, prev);
            if (jupiterSwapMode === react_hook_1.SwapMode.ExactIn) {
                newValue.toValue = (selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.outAmount)
                    ? String((0, utils_1.fromLamports)(selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.outAmount, (toTokenInfo === null || toTokenInfo === void 0 ? void 0 : toTokenInfo.decimals) || 0))
                    : '';
            }
            else {
                newValue.fromValue = (selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.inAmount)
                    ? String((0, utils_1.fromLamports)(selectedSwapRoute === null || selectedSwapRoute === void 0 ? void 0 : selectedSwapRoute.inAmount, (fromTokenInfo === null || fromTokenInfo === void 0 ? void 0 : fromTokenInfo.decimals) || 0))
                    : '';
            }
            return newValue;
        });
    }, [selectedSwapRoute, fromTokenInfo, toTokenInfo, jupiterSwapMode]);
    const [totalTxs, setTotalTxs] = (0, react_1.useState)(0);
    const [txStatus, setTxStatus] = (0, react_1.useState)([]);
    const onTransaction = (txid, totalTxs, txDescription, awaiter) => __awaiter(void 0, void 0, void 0, function* () {
        setTotalTxs(totalTxs);
        const tx = txStatus.find((tx) => tx.txid === txid);
        if (!tx) {
            setTxStatus((prev) => [...prev, { txid, txDescription, status: 'loading' }]);
        }
        const success = !((yield awaiter) instanceof Error);
        setTxStatus((prev) => {
            const tx = prev.find((tx) => tx.txid === txid);
            if (tx) {
                tx.status = success ? 'success' : 'fail';
            }
            return [...prev];
        });
    });
    const [lastSwapResult, setLastSwapResult] = (0, react_1.useState)(null);
    const onSubmit = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!walletPublicKey || !(wallet === null || wallet === void 0 ? void 0 : wallet.adapter) || !selectedSwapRoute) {
            return null;
        }
        try {
            const swapResult = yield exchange({
                wallet: wallet === null || wallet === void 0 ? void 0 : wallet.adapter,
                routeInfo: selectedSwapRoute,
                onTransaction,
                computeUnitPriceMicroLamports,
            });
            setLastSwapResult(swapResult);
            return swapResult;
        }
        catch (error) {
            console.log('Swap error', error);
            return null;
        }
    }), [walletPublicKey, selectedSwapRoute]);
    const refreshAll = () => {
        refresh();
        refreshAccount();
    };
    const reset = (0, react_1.useCallback)(({ resetValues } = { resetValues: true }) => {
        setTimeout(() => {
            if (resetValues) {
                setForm(Object.assign(Object.assign({}, exports.initialSwapContext.form), formProps));
                setupInitialAmount();
            }
            setSelectedSwapRoute(null);
            setErrors(exports.initialSwapContext.errors);
            setLastSwapResult(exports.initialSwapContext.lastSwapResult);
            setTxStatus(exports.initialSwapContext.swapping.txStatus);
            setTotalTxs(exports.initialSwapContext.swapping.totalTxs);
            refreshAccount();
        }, 0);
    }, [setupInitialAmount]);
    const [priorityFeeInSOL, setPriorityFeeInSOL] = (0, react_1.useState)(exports.PRIORITY_NONE);
    const computeUnitPriceMicroLamports = (0, react_1.useMemo)(() => {
        if (priorityFeeInSOL === undefined)
            return 0;
        return new decimal_js_1.default(priorityFeeInSOL)
            .mul(Math.pow(10, 9)) // sol into lamports
            .mul(Math.pow(10, 6)) // lamports into microlamports
            .div(1400000) // divide by CU
            .round()
            .toNumber();
    }, [priorityFeeInSOL]);
    return (<exports.SwapContext.Provider value={{
            form,
            setForm,
            errors,
            setErrors,
            fromTokenInfo,
            toTokenInfo,
            selectedSwapRoute,
            setSelectedSwapRoute,
            onSubmit,
            lastSwapResult,
            reset,
            displayMode,
            formProps,
            scriptDomain,
            swapping: {
                totalTxs,
                txStatus,
            },
            jupiter: {
                routes: jsbi_1.default.GT(amount, math_1.ZERO) ? swapRoutes : undefined,
                allTokenMints,
                routeMap,
                exchange,
                loading: loadingQuotes,
                refresh: refreshAll,
                lastRefreshTimestamp,
                error,
                asLegacyTransaction,
                setAsLegacyTransaction,
                priorityFeeInSOL,
                setPriorityFeeInSOL,
            },
        }}>
      {children}
    </exports.SwapContext.Provider>);
};
exports.SwapContextProvider = SwapContextProvider;
