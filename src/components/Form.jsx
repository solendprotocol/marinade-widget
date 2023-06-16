"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_number_format_1 = require("react-number-format");
const accounts_1 = require("../contexts/accounts");
const constants_1 = require("../misc/constants");
const FormError_1 = __importDefault(require("./FormError"));
const JupButton_1 = __importDefault(require("./JupButton"));
const TokenIcon_1 = __importDefault(require("./TokenIcon"));
const constants_2 = require("../constants");
const SwapContext_1 = require("src/contexts/SwapContext");
const useTimeDiff_1 = __importDefault(require("./useTimeDiff/useTimeDiff"));
const WalletPassthroughProvider_1 = require("src/contexts/WalletPassthroughProvider");
const ChevronDownIcon_1 = __importDefault(require("src/icons/ChevronDownIcon"));
const fa_1 = require("react-icons/fa");
const SexyChameleonText_1 = __importDefault(require("./SexyChameleonText/SexyChameleonText"));
const react_hook_1 = require("@jup-ag/react-hook");
const classnames_1 = __importDefault(require("classnames"));
const utils_1 = require("src/misc/utils");
const CoinBalanceUSD_1 = __importDefault(require("./CoinBalanceUSD"));
const Marinade_1 = __importDefault(require("src/icons/Marinade"));
const TokenContextProvider_1 = require("src/contexts/TokenContextProvider");
const DataProvider_1 = require("src/contexts/DataProvider");
const spl_token_1 = require("@solana/spl-token");
const ValidatorRow_1 = require("./ValidatorRow");
const ChevronUpIcon_1 = __importDefault(require("src/icons/ChevronUpIcon"));
const Form = ({ onSubmit, isDisabled, setSelectPairSelector, setIsWalletModalOpen, setShowRouteSelector }) => {
    var _a, _b, _c, _d, _e;
    const { connect, wallet } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const { accounts } = (0, accounts_1.useAccounts)();
    const [showTransactionInfo, setShowTransactionInfo] = (0, react_1.useState)(false);
    const { target, setTargetAmount, marinadeStats, deposit } = (0, DataProvider_1.useData)();
    const { tokenMap } = (0, TokenContextProvider_1.useTokenContext)();
    const { form, setForm, errors, fromTokenInfo, toTokenInfo, selectedSwapRoute, formProps: { swapMode, fixedAmount, fixedInputMint, fixedOutputMint, }, jupiter: { routes, loading, refresh }, } = (0, SwapContext_1.useSwapContext)();
    const [hasExpired, timeDiff] = (0, useTimeDiff_1.default)();
    (0, react_1.useEffect)(() => {
        if (hasExpired) {
            refresh();
        }
    }, [hasExpired]);
    const onConnectWallet = () => {
        if (wallet)
            connect();
        else {
            setIsWalletModalOpen(true);
        }
    };
    const walletPublicKey = (0, react_1.useMemo)(() => { var _a; return (_a = wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey) === null || _a === void 0 ? void 0 : _a.toString(); }, [wallet === null || wallet === void 0 ? void 0 : wallet.adapter.publicKey]);
    const onChangeToValue = (value) => {
        if (value === '') {
            setForm((form) => (Object.assign(Object.assign({}, form), { fromValue: '', toValue: '' })));
            return;
        }
        const isInvalid = Number.isNaN(value);
        if (isInvalid)
            return;
        setForm((form) => (Object.assign(Object.assign({}, form), { toValue: value })));
    };
    const balance = (0, react_1.useMemo)(() => {
        var _a;
        return fromTokenInfo ? ((_a = accounts[fromTokenInfo.address]) === null || _a === void 0 ? void 0 : _a.balance) || 0 : 0;
    }, [accounts, fromTokenInfo]);
    const onClickMax = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        if (!balance || swapMode === 'ExactOut')
            return;
        if ((fromTokenInfo === null || fromTokenInfo === void 0 ? void 0 : fromTokenInfo.address) === constants_2.WRAPPED_SOL_MINT.toBase58()) {
            setForm((prev) => (Object.assign(Object.assign({}, prev), { fromValue: String(balance > constants_1.MINIMUM_SOL_BALANCE ? (balance - constants_1.MINIMUM_SOL_BALANCE).toFixed(6) : 0) })));
        }
        else {
            setForm((prev) => (Object.assign(Object.assign({}, prev), { fromValue: String(balance) })));
        }
    }, [balance, fromTokenInfo]);
    const msolTokenInfo = tokenMap.get(constants_1.MSOL_MINT.toBase58());
    const solTokenInfo = tokenMap.get(spl_token_1.NATIVE_MINT.toBase58());
    const { inputAmountDisabled } = (0, react_1.useMemo)(() => {
        const result = { inputAmountDisabled: true, outputAmountDisabled: true };
        if (!fixedAmount) {
            if (swapMode === react_hook_1.SwapMode.ExactOut) {
                result.outputAmountDisabled = false;
            }
            else {
                result.inputAmountDisabled = false;
            }
        }
        return result;
    }, [fixedAmount, swapMode]);
    const marketRoutes = selectedSwapRoute ? selectedSwapRoute.marketInfos.map(({ label }) => label).join(', ') : '';
    const onClickSelectFromMint = (0, react_1.useCallback)(() => {
        if (fixedInputMint)
            return;
        setSelectPairSelector('fromMint');
    }, [fixedInputMint]);
    const onClickSelectToMint = (0, react_1.useCallback)(() => {
        if (fixedOutputMint)
            return;
        setSelectPairSelector('toMint');
    }, [fixedOutputMint]);
    const fixedOutputFomMintClass = (0, react_1.useMemo)(() => {
        if (swapMode === 'ExactOut' && !form.toValue)
            return 'opacity-20 hover:opacity-100';
        return '';
    }, [fixedOutputMint, form.toValue]);
    const thousandSeparator = (0, react_1.useMemo)(() => utils_1.detectedSeparator === ',' ? '.' : ',', []);
    // Allow empty input, and input lower than max limit
    const withValueLimit = (0, react_1.useCallback)(({ floatValue }) => !floatValue || floatValue <= constants_1.MAX_INPUT_LIMIT, []);
    const solAccount = accounts[spl_token_1.NATIVE_MINT.toString()];
    const mSolAccount = accounts[constants_1.MSOL_MINT.toString()];
    return (<div className="h-full flex flex-col items-center justify-center pb-1">
      <div className="w-full mt-2 rounded-xl flex flex-col px-2">
        <div className="flex-col">
        <div className="flex justify-between items-center">
        <span className='text-xs text-[#4A5568] font-semibold mb-1'>
          You&apos;re staking
          </span>
            {(target === null || target === void 0 ? void 0 : target.type) === 'native' && <span className='text-xs text-[#4A5568] text-thin'>
              <fa_1.FaWallet className='inline text-[#CBD5E0]'/> {(_a = solAccount === null || solAccount === void 0 ? void 0 : solAccount.balance) !== null && _a !== void 0 ? _a : 0} SOL{" "}
              <button type="button" className='font-light text-[#308D8A]' onClick={() => setTargetAmount(solAccount ? solAccount.balance / 2 : 0)}>
                HALF
                </button>
                {" "}
                <button type="button" className='font-light text-[#308D8A]' onClick={() => { var _a; return setTargetAmount((_a = solAccount === null || solAccount === void 0 ? void 0 : solAccount.balance) !== null && _a !== void 0 ? _a : 0); }}>
                MAX
                </button>
            </span>}
          </div>
          <div className={(0, classnames_1.default)("border-b border-transparent bg-[#F7FAFC] rounded-xl transition-all", fixedOutputFomMintClass)}>
            <div className={(0, classnames_1.default)("px-x border-transparent rounded-xl ")}>
              <div>
                <div className={(0, classnames_1.default)("p-4 flex flex-col dark:text-[#4A5568]")}>
                  <div className="flex justify-between items-center">
                    <button type="button" className={`py-2 px-2 rounded-lg flex items-center ${target ? '' : 'bg-[#308D8A]'} hover:bg-[#308D8A]/${target ? '25' : '75'} text-[#4A5568]`} disabled={fixedInputMint} onClick={onClickSelectFromMint}> 

                      {target && <div className="h-5 w-5">
                        {(_b = ((target === null || target === void 0 ? void 0 : target.type) === 'native' ? <TokenIcon_1.default tokenInfo={solTokenInfo} width={20} height={20}/> : null)) !== null && _b !== void 0 ? _b : ((target === null || target === void 0 ? void 0 : target.type) === 'stakeAccount' ? <div className="h-5 w-5 rounded-full" style={{
                    background: target.stakeAccount.background
                }}/> : null)}
                      </div>}
                      <div className="ml-2 font-semibold" translate="no">
                        {target && <span className="text-[#4A5568]">{' '}SOL</span>}
                        {!target && <span className={`${target ? 'text-[#4A5568]' : 'text-white'} fill-current mx-2`}>Select</span>}
                      </div>

                      <span className={`${target ? 'text-[#4A5568]' : 'text-white'} fill-current mx-2`}>
                          <ChevronDownIcon_1.default />
                        </span>
                    </button>

                    <div className="text-right">
                      <react_number_format_1.NumericFormat disabled={!((target === null || target === void 0 ? void 0 : target.type) === 'native')} value={target === null || target === void 0 ? void 0 : target.amount} decimalScale={fromTokenInfo === null || fromTokenInfo === void 0 ? void 0 : fromTokenInfo.decimals} thousandSeparator={thousandSeparator} allowNegative={false} valueIsNumericString onValueChange={({ value }) => setTargetAmount(Number(value))} placeholder={'0.00'} className={(0, classnames_1.default)("h-full w-full bg-transparent text-[#4A5568] text-right font-semibold dark:placeholder:text-[#4A5568]/25 text-lg", { 'cursor-not-allowed': inputAmountDisabled })} decimalSeparator={utils_1.detectedSeparator} isAllowed={withValueLimit}/>
                      {(solTokenInfo === null || solTokenInfo === void 0 ? void 0 : solTokenInfo.address) ? (<div className='flex justify-end items-center'>
                          {target ? (<span className='text-xs text-[#4A5568]'>
                              {' '}<CoinBalanceUSD_1.default tokenInfo={solTokenInfo} amount={target.amount.toString()}/>
                            </span>) : null}
                        </div>) : null}
                    </div>
                  </div>
                  <span className='text-xs text-[#4A5568] mb-[-12px] mt-[-4px]'>
          {(target === null || target === void 0 ? void 0 : target.type) === 'stakeAccount' ? `Stake account: ${(0, ValidatorRow_1.formatAddress)(target.stakeAccount.address)}` : <div className='h-4'/>}
          </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 mb-1">
            <span className='text-xs text-[#4A5568] font-semibold'>
            To receive
            </span>
            <span className='text-xs text-[#4A5568]'>
            <fa_1.FaWallet className='inline text-[#CBD5E0]'/> {(_c = mSolAccount === null || mSolAccount === void 0 ? void 0 : mSolAccount.balance) !== null && _c !== void 0 ? _c : 0} mSOL{" "}
            </span>
          </div>
          <div className="border-b border-transparent bg-[#F7FAFC] rounded-xl">
            <div className="px-x border-transparent rounded-xl">
              <div>
                <div className={(0, classnames_1.default)("p-4 flex flex-col dark:text-[#4A5568]")}>
                  <div className="flex justify-between items-center">
                    <button type="button" className="py-2 px-2 rounded-lg flex items-center text-[#4A5568]" disabled={true} onClick={onClickSelectToMint}>
                      <div className="h-5 w-5"><TokenIcon_1.default tokenInfo={msolTokenInfo} width={20} height={20}/></div>
                      <div className="mx-2 font-semibold" translate="no">
                        <span className="text-[#4A5568]">mSOL</span>
                      </div>
                    </button>

                    {(msolTokenInfo && marinadeStats && target) ? (<div className="text-right">
                      <react_number_format_1.NumericFormat disabled={!swapMode || swapMode === 'ExactIn'} value={(((_d = target === null || target === void 0 ? void 0 : target.amount) !== null && _d !== void 0 ? _d : 0) / marinadeStats.msolSolPrice).toString()} decimalScale={mSolAccount.decimals} thousandSeparator={thousandSeparator} allowNegative={false} valueIsNumericString onValueChange={({ value }) => onChangeToValue(value)} placeholder={swapMode === 'ExactOut' ? 'Enter desired amount' : ''} className={(0, classnames_1.default)("h-full w-full bg-transparent text-[#4A5568] text-right font-semibold dark:placeholder:text-[#4A5568]/25 placeholder:text-sm placeholder:font-normal text-lg")} decimalSeparator={utils_1.detectedSeparator} isAllowed={withValueLimit}/>
                      <div className='flex justify-end items-center'>
                        <span className='text-xs text-[#4A5568]'>
                          {' '}<CoinBalanceUSD_1.default tokenInfo={msolTokenInfo} amount={(target.amount / marinadeStats.msolSolPrice).toString()}/>
                        </span>
                        </div>
                    </div>) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {walletPublicKey ? <FormError_1.default errors={errors}/> : null}
      </div>

    <div className="flex justify-between w-full p-2">
    <span className='font-normal text-xs text-[#4A5568]'>
  Deposit fee: {((_e = ((target === null || target === void 0 ? void 0 : target.type) === 'native' ? marinadeStats === null || marinadeStats === void 0 ? void 0 : marinadeStats.rewardDepositFee : marinadeStats === null || marinadeStats === void 0 ? void 0 : marinadeStats.rewardDepositStakeFee)) !== null && _e !== void 0 ? _e : 0) / 100}%
    </span>
    <span className='font-normal text-xs text-[#4A5568] '>
  
    </span>
    </div>
      <div className="w-full px-2">
        {!walletPublicKey ? (<JupButton_1.default size="lg" className="w-full" type="button" onClick={onConnectWallet}>
            Connect Wallet
          </JupButton_1.default>) : (<JupButton_1.default size="md" className="w-full disabled:opacity-50 bg-[#308D8A]" type="button" onClick={deposit} disabled={!target || !target.amount}>
            {loading ? <span className="text-sm">Loading...</span> : <SexyChameleonText_1.default>Stake</SexyChameleonText_1.default>}
          </JupButton_1.default>)}
      </div>
      <div className='flex flex-col gap-1 w-full'>
      {target && marinadeStats && <div className="flex justify-between w-full px-2 mt-2">
      <span className='font-normal text-xs text-[#4A5568]'>
        1 mSOL ≈ {marinadeStats.msolSolPrice.toFixed(6)} SOL
      </span>
      <span className='flex items-center gap-1 font-normal text-xs text-[#4A5568] cursor-pointer' onClick={() => setShowTransactionInfo(!showTransactionInfo)}>
      {showTransactionInfo ? <><ChevronDownIcon_1.default /> Hide</> : <><ChevronUpIcon_1.default /> Show</>} transaction info
      </span>
      </div>}
      {target && marinadeStats && <div className="flex justify-between w-full px-2">
      <span className='font-normal text-xs text-[#4A5568]'>
        Staking reward fee
      </span>
      <span className='font-normal text-xs text-[#4A5568] '>
        {marinadeStats.stakingRewardFee}%
      </span>
      </div>}
      </div>

      <div className='flex justify-between items-center mt-6'>
        <Marinade_1.default />
      </div>
    </div>);
};
exports.default = Form;
