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
exports.PAIR_ROW_HEIGHT = void 0;
const react_1 = __importStar(require("react"));
const LeftArrowIcon_1 = __importDefault(require("src/icons/LeftArrowIcon"));
const fa_1 = require("react-icons/fa");
const ChevronDownIcon_1 = __importDefault(require("src/icons/ChevronDownIcon"));
const ValidatorSelector_1 = __importDefault(require("./ValidatorSelector"));
const DataProvider_1 = require("src/contexts/DataProvider");
const ValidatorIcon_1 = __importDefault(require("./ValidatorIcon"));
exports.PAIR_ROW_HEIGHT = 72;
const ModeRadio = ({ label, selected, children, onClick }) => {
    return <div onClick={onClick} className={selected ? "cursor-pointer w-full justify-between p-4 border rounded-lg border-[#98D7C3] bg-[#ECFAF5]" : "cursor-pointer w-full justify-between p-4 border rounded-lg border-[#EDF2F7] bg-[#F7FAFC]"}>
  <div className="flex w-full justify-between">
    <span className='text-xs text-[#4A5568] font-semibold mb-1'>{label}</span>
    {selected ? <span className='mb-4 text-[#308D8A]'><fa_1.FaCheckCircle /></span> : <span className='mb-4 text-[#E2E8F0]'><fa_1.FaRegCircle /></span>}
    </div>
    {children}
  </div>;
};
const DelegationStrategy = ({ onSubmit, tokenInfos, onClose, }) => {
    const [searchResult, setSearchResult] = (0, react_1.useState)(tokenInfos);
    const [showValidatorSelector, setShowValidatorSelector] = (0, react_1.useState)();
    const { validators, setDelegationStrategy, delegationStrategy } = (0, DataProvider_1.useData)();
    const [selectedValidator, setSelectedValidator] = (0, react_1.useState)(delegationStrategy);
    const inputRef = (0, react_1.createRef)();
    (0, react_1.useEffect)(() => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, [inputRef]);
    if (showValidatorSelector) {
        return <ValidatorSelector_1.default onSubmit={(validator) => {
                setSelectedValidator(validator);
                setDelegationStrategy(validator);
                setShowValidatorSelector(false);
            }} tokenInfos={tokenInfos} onClose={() => setShowValidatorSelector(false)}/>;
    }
    return (<div className="flex flex-col h-full w-full p-4 gap-4">
    <div className="flex w-full justify-between">
      <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={onClose}>
        <LeftArrowIcon_1.default width={24} height={24}/>
      </div>

      <div className="text-[#4A5568] font-bold">Delegation strategy settings</div>

      <div className=" w-6 h-6"/>
    </div>
    <ModeRadio selected={Boolean(!delegationStrategy)} onClick={() => setDelegationStrategy(null)} label={`Automatic (${validators.length} validators)`}>
      <span className='text-xs text-gray-500'>Automatically rebalance the stake on the most performing validators.</span>
    </ModeRadio>
    <ModeRadio selected={Boolean(delegationStrategy)} label='Manual (1 validator)' onClick={() => {
            if (selectedValidator) {
                setDelegationStrategy(selectedValidator);
            }
            else {
                setShowValidatorSelector(true);
            }
        }}>
      
      <button type="button" className="py-2 pr-3 pl-3 mb-2 w-full border-[#98D7C3]/50 border rounded-lg flex items-center hover:border-[#98D7C3]/75 justify-between" onClick={() => setShowValidatorSelector(true)}> 
                        {selectedValidator ? <span className='flex gap-4 items-center'><ValidatorIcon_1.default tokenInfo={selectedValidator} width={24} height={24}/>{' '}<span className='text-xs text-gray-500'>{selectedValidator.name}</span></span> : <span className="text-xs text-gray-500">Select a validator</span>}
                        <span className="fill-current mx-2">
                          <ChevronDownIcon_1.default />
                        </span>
                    </button>
        <span className='text-xs text-gray-500'>Direct stake to a specific validator.  <a>See how it works</a></span>
    </ModeRadio>
    </div>);
};
exports.default = DelegationStrategy;
