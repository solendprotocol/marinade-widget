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
exports.DataProvider = exports.useData = exports.DataContext = void 0;
const react_1 = require("react");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const axios_1 = __importDefault(require("axios"));
const marinade_ts_sdk_1 = require("@marinade.finance/marinade-ts-sdk");
const util_1 = require("@marinade.finance/marinade-ts-sdk/dist/src/util");
const WalletPassthroughProvider_1 = require("./WalletPassthroughProvider");
const web3_js_1 = require("@solana/web3.js");
const ValidatorRow_1 = require("src/components/ValidatorRow");
const ScreenProvider_1 = require("./ScreenProvider");
const defaultContextValues = {
    validators: [],
    stakeMode: 'liquid',
    stakeAccounts: [],
    target: null,
    delegationStrategy: null,
    marinadeStats: null,
    deposit: () => Promise.resolve(''),
    setTarget: () => undefined,
    setStakeMode: () => undefined,
    setTargetAmount: () => undefined,
    setDelegationStrategy: () => undefined,
};
const VALIDATORS_API = 'https://validators-api.marinade.finance/validators?limit=9999&epochs=0';
const MSOLSOLPRICE_API = 'https://api.marinade.finance/msol/price_sol';
exports.DataContext = (0, react_1.createContext)(defaultContextValues);
function useData() {
    return (0, react_1.useContext)(exports.DataContext);
}
exports.useData = useData;
const WALLET_OFFSET = 44;
const DATA_SIZE = 200;
function getRandomHEXColor(seed) {
    let output = '#';
    const chars = '0123456789abcdef';
    while (output.length < 7) {
        output += chars[seed[output.length].charCodeAt(0) % chars.length];
    }
    return output;
}
const DataProvider = ({ formProps, children }) => {
    const [validators, setValidators] = (0, react_1.useState)(defaultContextValues.validators);
    const [stakeMode, setStakeMode] = (0, react_1.useState)(defaultContextValues.stakeMode);
    const [target, setTarget] = (0, react_1.useState)(defaultContextValues.target);
    const [marinadeStats, setMarinadeStats] = (0, react_1.useState)(null);
    const { publicKey, wallet } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const { setScreen, setContext } = (0, ScreenProvider_1.useScreenState)();
    const [stakeAccounts, setStakeAccounts] = (0, react_1.useState)([]);
    const [delegationStrategy, setDelegationStrategy] = (0, react_1.useState)(defaultContextValues.delegationStrategy);
    const marinadeConfig = (0, react_1.useMemo)(() => {
        const defaultConfig = new marinade_ts_sdk_1.MarinadeConfig({
            connection,
            publicKey,
        });
        try {
            if (!(formProps === null || formProps === void 0 ? void 0 : formProps.referralCode))
                return defaultConfig;
            console.log('never');
            return new marinade_ts_sdk_1.MarinadeConfig({
                referralCode: new web3_js_1.PublicKey(formProps.referralCode),
                connection,
                publicKey,
            });
        }
        catch (e) {
            console.error('Invalid referral code');
            return defaultConfig;
        }
    }, [formProps === null || formProps === void 0 ? void 0 : formProps.referralCode, publicKey]);
    function fetchValidators() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = (yield axios_1.default.get(VALIDATORS_API)).data;
            setValidators(response.validators.map(v => {
                var _a;
                return ({
                    address: v.identity,
                    name: (_a = v.info_name) !== null && _a !== void 0 ? _a : (0, ValidatorRow_1.formatAddress)(v.identity),
                    voteAddress: v.vote_account,
                    score: v.score,
                    logo: `https://keybase.io/${v.info_keybase}/picture?format=square_360`,
                });
            }));
        });
    }
    ;
    function fetchMarinadeStats() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const marinade = new marinade_ts_sdk_1.Marinade(marinadeConfig);
            const response = (yield axios_1.default.get(MSOLSOLPRICE_API)).data;
            const state = yield marinade.getMarinadeState();
            console.log(marinadeConfig.referralCode);
            const partnerState = marinadeConfig.referralCode ? yield marinade.getReferralPartnerState() : null;
            setMarinadeStats({
                msolSolPrice: response,
                stakingRewardFee: state.rewardsCommissionPercent,
                rewardDepositFee: (_a = partnerState === null || partnerState === void 0 ? void 0 : partnerState.state.operationDepositSolFee) !== null && _a !== void 0 ? _a : 0,
                rewardDepositStakeFee: (_b = partnerState === null || partnerState === void 0 ? void 0 : partnerState.state.operationDepositStakeAccountFee) !== null && _b !== void 0 ? _b : 0,
            });
        });
    }
    function setTargetAmount(amount) {
        setTarget(target ? Object.assign(Object.assign({}, target), { amount }) : null);
    }
    function deposit() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!wallet || !target)
                return;
            try {
                const marinade = new marinade_ts_sdk_1.Marinade(marinadeConfig);
                const bnAmount = new marinade_ts_sdk_1.BN((0, util_1.solToLamports)(target.amount));
                const { transaction } = yield marinade.deposit(bnAmount, {
                    directToValidatorVoteAddress: delegationStrategy ? new web3_js_1.PublicKey(delegationStrategy.voteAddress) : undefined
                });
                setScreen('Signing');
                const signature = yield wallet.adapter.sendTransaction(transaction, connection);
                const latestBlockhash = yield connection.getLatestBlockhash();
                setScreen('Confirming');
                yield connection.confirmTransaction(Object.assign({ signature }, latestBlockhash), 'confirmed');
                setScreen('Success');
                setContext({
                    message: signature,
                    callback: () => {
                        setScreen('Initial');
                        setTargetAmount(0);
                    }
                });
                return signature;
            }
            catch (e) {
                setScreen('Error');
                setContext({
                    message: String((_a = e.message) !== null && _a !== void 0 ? _a : e),
                    callback: () => {
                        setScreen('Initial');
                    }
                });
            }
        });
    }
    function fetchStakeAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!publicKey)
                return;
            const stakeAccounts = yield connection.getParsedProgramAccounts(util_1.STAKE_PROGRAM_ID, {
                filters: [
                    {
                        dataSize: DATA_SIZE, // number of bytes
                    },
                    {
                        memcmp: {
                            offset: WALLET_OFFSET,
                            bytes: publicKey.toString(), // base58 encoded string
                        },
                    },
                ],
            });
            const currentEpoch = yield (yield connection.getEpochInfo()).epoch;
            setStakeAccounts(stakeAccounts
                .map((s) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const activationEpoch = (_g = (_f = (_e = (_d = (_c = (_b = (_a = s === null || s === void 0 ? void 0 : s.account) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.parsed) === null || _c === void 0 ? void 0 : _c.info) === null || _d === void 0 ? void 0 : _d.stake) === null || _e === void 0 ? void 0 : _e.delegation) === null || _f === void 0 ? void 0 : _f.activationEpoch) !== null && _g !== void 0 ? _g : null;
                const waitEpochs = 2;
                const earliestDepositEpoch = Number(activationEpoch) + waitEpochs;
                let status = 'active';
                const balance = s.account.lamports / web3_js_1.LAMPORTS_PER_SOL;
                if (earliestDepositEpoch > currentEpoch) {
                    status = 'inactive';
                }
                if (balance < 1) {
                    status = 'minBalance';
                }
                return {
                    balance: balance.toString(),
                    address: s.pubkey.toString(),
                    background: `linear-gradient(to top,${getRandomHEXColor(s.pubkey.toString())}, ${getRandomHEXColor(s.pubkey.toString().slice(7, 17))})`,
                    status,
                    data: s.account,
                };
            })
                .sort((s) => (s.status === 'active' ? -1 : 1)));
        });
    }
    (0, react_1.useEffect)(() => {
        fetchValidators();
        fetchMarinadeStats();
    }, [formProps]);
    (0, react_1.useEffect)(() => {
        fetchStakeAccounts();
    }, [publicKey]);
    return <exports.DataContext.Provider value={{
            validators,
            stakeMode,
            setStakeMode,
            stakeAccounts,
            deposit,
            delegationStrategy,
            setDelegationStrategy,
            target,
            marinadeStats,
            setTarget,
            setTargetAmount,
        }}>{children}</exports.DataContext.Provider>;
};
exports.DataProvider = DataProvider;
