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
exports.PRIORITY_TEXT = void 0;
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_number_format_1 = require("react-number-format");
const classnames_1 = __importDefault(require("classnames"));
const SwapSettingButton_1 = __importDefault(require("./SwapSettingButton"));
const InformationMessage_1 = __importDefault(require("../InformationMessage"));
const CloseIcon_1 = __importDefault(require("src/icons/CloseIcon"));
const InfoIconSVG_1 = __importDefault(require("src/icons/InfoIconSVG"));
const Tooltip_1 = __importDefault(require("../Tooltip"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const JupButton_1 = __importDefault(require("../JupButton"));
const utils_1 = require("src/misc/utils");
const SlippageConfigProvider_1 = require("src/contexts/SlippageConfigProvider");
const SwapContext_1 = require("src/contexts/SwapContext");
const Toggle_1 = __importDefault(require("../Toggle"));
const TokenContextProvider_1 = require("src/contexts/TokenContextProvider");
const ExternalIcon_1 = __importDefault(require("src/icons/ExternalIcon"));
const Separator = () => <div className="my-4 border-b border-white/10"/>;
const MINIMUM_SLIPPAGE = 0;
const MAXIMUM_SLIPPAGE = 50; // 50%
const MINIMUM_SUGGESTED_SLIPPAGE = 0.05; // 0.05%
const MAXIMUM_SUGGESTED_SLIPPAGE = 10; // 10%
exports.PRIORITY_TEXT = {
    [SwapContext_1.PRIORITY_NONE]: `Normal`,
    [SwapContext_1.PRIORITY_HIGH]: `High`,
    [SwapContext_1.PRIORITY_TURBO]: `Turbo`,
};
const PRIORITY_PRESET = [SwapContext_1.PRIORITY_NONE, SwapContext_1.PRIORITY_HIGH, SwapContext_1.PRIORITY_TURBO];
const SetSlippage = ({ closeModal }) => {
    const { jupiter: { asLegacyTransaction, setAsLegacyTransaction, priorityFeeInSOL, setPriorityFeeInSOL } } = (0, SwapContext_1.useSwapContext)();
    const { slippage, setSlippage } = (0, SlippageConfigProvider_1.useSlippageConfig)();
    const { preferredTokenListMode, setPreferredTokenListMode } = (0, TokenContextProvider_1.useTokenContext)();
    const SLIPPAGE_PRESET = (0, react_1.useMemo)(() => ['0.1', String(SlippageConfigProvider_1.DEFAULT_SLIPPAGE), '1.0'], [SlippageConfigProvider_1.DEFAULT_SLIPPAGE]);
    const slippageInitialPreset = (0, react_1.useMemo)(() => {
        return SLIPPAGE_PRESET.find((preset) => Number(preset) === slippage);
    }, [slippage, SLIPPAGE_PRESET]);
    const priorityInitialPreset = (0, react_1.useMemo)(() => {
        return PRIORITY_PRESET.find((preset) => Number(preset) === priorityFeeInSOL);
    }, [priorityFeeInSOL]);
    const form = (0, react_hook_form_1.useForm)({
        defaultValues: Object.assign(Object.assign(Object.assign({}, (slippage
            ? slippageInitialPreset
                ? {
                    slippagePreset: String(slippageInitialPreset),
                }
                : {
                    slippageInput: String(slippage),
                }
            : {})), (typeof priorityFeeInSOL !== 'undefined' && typeof priorityInitialPreset !== 'undefined'
            ? {
                priorityInSOLPreset: priorityInitialPreset,
            }
            : {
                priorityInSOLInput: priorityFeeInSOL,
            })), { asLegacyTransaction,
            preferredTokenListMode }),
    });
    /* SLIPPAGE */
    const [inputFocused, setInputFocused] = (0, react_1.useState)(!slippageInitialPreset);
    const slippageInput = form.watch('slippageInput');
    const slippagePreset = form.watch('slippagePreset');
    const isWithinSlippageLimits = (0, react_1.useMemo)(() => {
        return Number(slippageInput) >= MINIMUM_SLIPPAGE && Number(slippageInput) <= MAXIMUM_SLIPPAGE;
    }, [slippageInput]);
    const slippageSuggestionText = (0, react_1.useMemo)(() => {
        if (Number(slippageInput) <= MINIMUM_SUGGESTED_SLIPPAGE) {
            return <span>Your transaction may fail</span>;
        }
        if (Number(slippageInput) >= MAXIMUM_SUGGESTED_SLIPPAGE) {
            return <span>Warning, slippage is high</span>;
        }
        return '';
    }, [slippageInput]);
    const inputRef = (0, react_1.useRef)();
    /* END OF SLIPPAGE */
    /* PRIORITY FEE */
    const [inputPriorityFocused, setInputPriorityFocused] = (0, react_1.useState)(typeof priorityInitialPreset === 'undefined');
    const priorityInSOLPreset = form.watch('priorityInSOLPreset');
    const inputPriorityRef = (0, react_1.useRef)();
    const priorityInSOLInput = form.watch('priorityInSOLInput');
    const isWithinPriorityLimits = (0, react_1.useMemo)(() => {
        return Number(priorityInSOLInput) <= SwapContext_1.PRIORITY_MAXIMUM_SUGGESTED;
    }, [priorityInSOLInput]);
    const prioritySuggestionText = (0, react_1.useMemo)(() => {
        if (Number(priorityInSOLInput) > SwapContext_1.PRIORITY_MAXIMUM_SUGGESTED) {
            return (<span>
          Warning, max priority fee is over the suggested amount of {utils_1.formatNumber.format(SwapContext_1.PRIORITY_MAXIMUM_SUGGESTED)}{' '}
          SOL.
        </span>);
        }
        return '';
    }, [priorityInSOLInput]);
    /* END OF PRIORITY FEE */
    const isDisabled = (() => {
        const isSlippageDisabled = (() => {
            if (inputFocused && !slippageInput)
                return true;
            if (slippagePreset)
                return false;
            else
                return !isWithinSlippageLimits;
        })();
        const isPriorityInputDisabled = (() => {
            if (inputPriorityFocused && !priorityInSOLInput)
                return true;
            if (typeof priorityInSOLPreset !== 'undefined')
                return false;
            else
                return !isWithinPriorityLimits;
        })();
        return isSlippageDisabled || isPriorityInputDisabled;
    })();
    const asLegacyTransactionInput = form.watch('asLegacyTransaction');
    const preferredTokenListModeInput = form.watch('preferredTokenListMode');
    const onClickSave = () => {
        if (isDisabled)
            return;
        const slippage = Number(slippageInput !== null && slippageInput !== void 0 ? slippageInput : slippagePreset);
        if (typeof slippage === 'number') {
            setSlippage(slippage);
        }
        const priority = Number(priorityInSOLInput !== null && priorityInSOLInput !== void 0 ? priorityInSOLInput : priorityInSOLPreset);
        if (typeof priority === 'number') {
            setPriorityFeeInSOL(priority);
        }
        setAsLegacyTransaction(asLegacyTransactionInput);
        setPreferredTokenListMode(preferredTokenListModeInput);
        closeModal();
    };
    return (<div className={(0, classnames_1.default)('w-full rounded-xl flex flex-col bg-jupiter-bg text-[#4A5568] shadow-xl max-h-[90%]')}>
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <div className="text-sm font-semibold">
          <span>Swap Settings</span>
        </div>
        <div className="text-[#4A5568] fill-current cursor-pointer" onClick={() => closeModal()}>
          <CloseIcon_1.default width={14} height={14}/>
        </div>
      </div>

      <form onSubmit={form.handleSubmit((value) => {
            var _a;
            const slippage = Number((_a = value.slippageInput) !== null && _a !== void 0 ? _a : value.slippagePreset);
            if (typeof slippage === 'number') {
                setSlippage(slippage);
                closeModal();
            }
        })} className={(0, classnames_1.default)('relative w-full overflow-y-auto webkit-scrollbar')}>
        <div>
          <div className={(0, classnames_1.default)('mt-2 px-5')}>
            {/**************************** PRIORTY *****************************/}
            <div className="flex items-center text-sm text-[#4A5568]/75 font-[500]">
              <span>Transaction Priority</span>
              <Tooltip_1.default variant="dark" className='!left-24 !top-16 w-[50%]' content={<span className="flex rounded-lg text-xs text-[#4A5568]/75">
                    The priority fee is paid to the Solana network. This additional fee helps boost how a transaction
                    is prioritized against others, resulting in faster transaction execution times.
                  </span>}>
                <div className="flex ml-2.5 items-center text-[#4A5568]-35 fill-current">
                  <InfoIconSVG_1.default width={12} height={12}/>
                </div>
              </Tooltip_1.default>
            </div>

            <div className="flex items-center mt-2.5 rounded-xl ring-1 ring-white/5 overflow-hidden">
              <react_hook_form_1.Controller name="priorityInSOLInput" control={form.control} render={({}) => {
            return (<>
                      {PRIORITY_PRESET.map((item, idx) => {
                    const name = exports.PRIORITY_TEXT[item];
                    return (<SwapSettingButton_1.default key={idx} idx={idx} itemsCount={PRIORITY_PRESET.length} roundBorder={idx === 0 ? 'left' : idx === SLIPPAGE_PRESET.length - 1 ? 'right' : undefined} highlighted={!inputPriorityFocused && priorityInSOLPreset === item} onClick={() => {
                            form.setValue('priorityInSOLPreset', item);
                            form.setValue('priorityInSOLInput', undefined);
                            setInputPriorityFocused(false);
                        }}>
                            <div>
                              <p className="text-sm text-[#4A5568]">{name}</p>
                              <span className="mt-1 text-xs">{item} SOL</span>
                            </div>
                          </SwapSettingButton_1.default>);
                })}
                    </>);
        }}/>
            </div>

            <div className='mt-1'>
              <span className="text-[#4A5568]/75 font-500 text-xs">or set manually:</span>

              <div className={`relative mt-1 ${inputPriorityFocused ? 'v2-border-gradient v2-border-gradient-center' : ''}`}>
                <react_hook_form_1.Controller name={'priorityInSOLInput'} control={form.control} render={({ field: { onChange, value } }) => {
            const thousandSeparator = utils_1.detectedSeparator === ',' ? '.' : ',';
            return (<react_number_format_1.NumericFormat value={typeof value === 'undefined' ? '' : value} decimalScale={9} thousandSeparator={thousandSeparator} getInputRef={(el) => (inputPriorityRef.current = el)} allowNegative={false} onValueChange={({ floatValue }) => {
                    onChange(floatValue);
                    // Prevent both slippageInput and slippagePreset to reset each oter
                    if (typeof floatValue !== 'undefined') {
                        form.setValue('priorityInSOLPreset', undefined);
                    }
                }} onFocus={() => {
                    var _a;
                    (_a = inputPriorityRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                    setInputPriorityFocused(true);
                }} maxLength={12} placeholder={'0.0000'} className={`text-left h-full w-full bg-[#1B1B1E] placeholder:text-[#4A5568]/25 py-4 px-5 text-sm rounded-xl ring-1ring-white/5 text-[#4A5568]/50 pointer-events-all relative`} decimalSeparator={utils_1.detectedSeparator}/>);
        }}/>
                <span className="absolute right-4 top-4 text-sm text-[#4A5568]/50">SOL</span>
              </div>

              <div className="">
                {typeof priorityInSOLPreset === 'undefined' && priorityInSOLInput !== 0 ? (<span className="text-xs text-[#4A5568]/50">
                    <span>This will cost an additional {new decimal_js_1.default(priorityInSOLInput || 0).toString()} SOL.</span>
                  </span>) : null}

                {inputPriorityFocused && !isWithinPriorityLimits && (<InformationMessage_1.default iconSize={14} className="!text-jupiter-primary !px-0" message={`Please set a priority fee within ${utils_1.formatNumber.format(SwapContext_1.PRIORITY_MAXIMUM_SUGGESTED)} SOL`}/>)}

                {typeof priorityInSOLPreset === 'undefined' && prioritySuggestionText && (<InformationMessage_1.default iconSize={14} className="!text-jupiter-primary !px-0 mb-2" message={prioritySuggestionText}/>)}
              </div>
            </div>

            <Separator />
            {/**************************** SLIPPAGE *****************************/}
            <div className="flex items-center text-sm text-[#4A5568]/75 font-[500]">
              <span>Slippage Settings</span>
            </div>

            <div className="flex items-center mt-2.5 rounded-xl ring-1 ring-white/5 overflow-hidden text-sm h-[52px]">
              <react_hook_form_1.Controller name="slippagePreset" control={form.control} render={({ field: { onChange, value } }) => {
            return (<>
                      {SLIPPAGE_PRESET.map((item, idx) => {
                    const displayText = utils_1.formatNumber.format(Number(item)) + '%';
                    return (<SwapSettingButton_1.default key={idx} idx={idx} itemsCount={SLIPPAGE_PRESET.length} className="h-full" roundBorder={idx === 0 ? 'left' : undefined} highlighted={!inputFocused && Number(value) === Number(item)} onClick={() => {
                            onChange(item);
                            setInputFocused(false);
                            form.setValue('slippageInput', undefined);
                        }}>
                            {displayText}
                          </SwapSettingButton_1.default>);
                })}
                    </>);
        }}/>

              <div onClick={() => {
            var _a;
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            setInputFocused(true);
        }} className={`flex items-center justify-between cursor-text w-[120px] h-full text-[#4A5568]/50 bg-[#1B1B1E] pl-2 text-sm relative border-l border-black-10 border-white/5 ${inputFocused ? 'v2-border-gradient v2-border-gradient-right' : ''}`}>
                <span className="text-xs">
                  <span>Custom</span>
                </span>

                <react_hook_form_1.Controller name={'slippageInput'} control={form.control} render={({ field: { onChange, value } }) => (<react_number_format_1.NumericFormat value={typeof value === 'undefined' ? '' : value} decimalScale={2} isAllowed={(value) => {
                // This is for onChange events, we dont care about Minimum slippage here, to allow more natural inputs
                return (value.floatValue || 0) <= 100 && (value.floatValue || 0) >= 0;
            }} getInputRef={(el) => (inputRef.current = el)} allowNegative={false} onValueChange={({ floatValue }) => {
                onChange(floatValue);
                // Prevent both slippageInput and slippagePreset to reset each oter
                if (typeof floatValue !== 'undefined') {
                    form.setValue('slippagePreset', undefined);
                }
            }} allowLeadingZeros={false} suffix="%" className="h-full w-full bg-transparent py-4 pr-4 text-sm rounded-lg placeholder:text-[#4A5568]/25 text-[#4A5568]/50 text-right pointer-events-all" decimalSeparator={utils_1.detectedSeparator} placeholder={utils_1.detectedSeparator === ',' ? '0,00%' : '0.00%'}/>)}/>
              </div>
            </div>

            <div>
              {inputFocused && !isWithinSlippageLimits && (<InformationMessage_1.default iconSize={14} className="!text-jupiter-primary !px-0" message={`Please set a slippage value that is within ${MINIMUM_SLIPPAGE}% to ${MAXIMUM_SLIPPAGE}%`}/>)}

              {slippageSuggestionText && (<InformationMessage_1.default iconSize={14} className="!text-jupiter-primary !px-0" message={slippageSuggestionText}/>)}
            </div>

            <Separator />

            <div className='flex items-center justify-between mt-2'>
              <div className='flex items-center space-x-2'>
                <p className='text-sm font-semibold'>Versioned Tx.</p>

                <a href='https://docs.jup.ag/integrating-jupiter-1/additional-guides/composing-with-versioned-transactions#what-are-versioned-transactions' rel="noreferrer" target={'_blank'} className='cursor-pointer'>
                  <ExternalIcon_1.default />
                </a>
              </div>

              <Toggle_1.default active={!asLegacyTransactionInput} onClick={() => form.setValue('asLegacyTransaction', !asLegacyTransactionInput)}/>
            </div>
            <p className='mt-2 text-xs text-[#4A5568]/50'>
              Versioned Tx is a significant upgrade that allows for more advanced routings and better prices! Make
              sure your connected wallet is compatible before toggling on Ver. Tx. Current compatible wallets:
              Phantom, Solflare, Glow and Backpack.
            </p>

            <Separator />

            <div className='flex items-center justify-between mt-2'>
              <div className='flex items-center space-x-2'>
                <p className='text-sm font-semibold'>Strict Token list</p>

                <a href='https://docs.jup.ag/api/token-list-api' rel="noreferrer" target={'_blank'} className='cursor-pointer'>
                  <ExternalIcon_1.default />
                </a>
              </div>
              <Toggle_1.default active={preferredTokenListModeInput === 'strict'} onClick={() => form.setValue('preferredTokenListMode', preferredTokenListModeInput === 'strict' ? 'all' : 'strict')}/>
            </div>
            <p className='mt-2 text-xs text-[#4A5568]/50'>
              {`The strict list contains a smaller set of validated tokens. To see all tokens, toggle "off".`}
            </p>
          </div>

          <div className="px-5 pb-5">
            <JupButton_1.default type="button" onClick={onClickSave} className={'w-full mt-4'} disabled={isDisabled} size={'lg'}>
              <span>Save Settings</span>
            </JupButton_1.default>
          </div>
        </div>
      </form>
    </div>);
};
exports.default = SetSlippage;
