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
const react_window_1 = require("react-window");
const LeftArrowIcon_1 = __importDefault(require("src/icons/LeftArrowIcon"));
const fa_1 = require("react-icons/fa");
const FormPairRow_1 = __importDefault(require("./FormPairRow"));
const DataProvider_1 = require("src/contexts/DataProvider");
exports.PAIR_ROW_HEIGHT = 72;
const SEARCH_BOX_HEIGHT = 56;
// eslint-disable-next-line react/display-name
const rowRenderer = (0, react_1.memo)((props) => {
    const { data, index, style } = props;
    const item = data.searchResult[index];
    return <FormPairRow_1.default key={item.address} item={item} style={style} onSubmit={data.onSubmit}/>;
}, react_window_1.areEqual);
const ModeRadio = ({ selected, children }) => {
    return <div className={selected ? "w-full justify-between p-4 border rounded-lg border-[#98D7C3] bg-[#ECFAF5]" : "w-full justify-between p-4 border rounded-lg border-[#EDF2F7] bg-[#F7FAFC]"}>
  <div className="flex w-full justify-between">
    <span className='text-xs text-[#4A5568] font-semibold mb-1'>Liquid staking</span>
    <span className='mb-4 text-[#308D8A]'><fa_1.FaCheckCircle /></span>
    </div>
    <span className='text-xs text-gray-500'>Stake your SOL without locking them up and earn staking rewards while staying completely liquid. Use mSOL (staked SOL) in DeFi.</span>
  </div>;
};
const StakeModeSettings = ({ onSubmit, tokenInfos, onClose, }) => {
    const { stakeMode, setStakeMode } = (0, DataProvider_1.useData)();
    const inputRef = (0, react_1.createRef)();
    (0, react_1.useEffect)(() => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, [inputRef]);
    return (<div className="flex flex-col h-full w-full p-4 gap-4">
    <div className="flex w-full justify-between">
      <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={onClose}>
        <LeftArrowIcon_1.default width={24} height={24}/>
      </div>

      <div className="text-[#4A5568] font-bold">Stake mode settings</div>

      <div className=" w-6 h-6"/>
    </div>
      <div className="w-full justify-between p-4 border rounded-lg border-[#98D7C3] bg-[#ECFAF5]">
      <div className="flex w-full justify-between">
        <span className='text-xs text-[#4A5568] font-semibold mb-1'>Liquid staking</span>
        <span className='mb-4 text-[#308D8A]'><fa_1.FaCheckCircle /></span>
        </div>
        <span className='text-xs text-gray-500'>Stake your SOL without locking them up and earn staking rewards while staying completely liquid. Use mSOL (staked SOL) in DeFi.</span>
      </div>
      <div className="w-full justify-between p-4 border rounded-lg border-[#EDF2F7] bg-[#F7FAFC]">
      <div className="flex w-full justify-between">
        
      <span className='text-xs text-[#4A5568] font-semibold mb-1'>Native staking</span>
        <span className='mb-4 text-[#E2E8F0]'><fa_1.FaRegCircle /></span>
        </div>
        <span className='text-xs text-gray-500'>Lock up your tokens in Solana’s native staking contract to earn staking rewards. No smart contract risk.</span>
        </div>
    </div>);
};
exports.default = StakeModeSettings;
