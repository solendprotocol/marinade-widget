"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const SlippageConfigProvider_1 = require("src/contexts/SlippageConfigProvider");
const SwapContext_1 = require("src/contexts/SwapContext");
const tb_1 = require("react-icons/tb");
const WalletComponents_1 = require("./WalletComponents");
const DataProvider_1 = require("src/contexts/DataProvider");
const Header = ({ setIsWalletModalOpen, setShowStakeModeSettings, setShowDelegationStrategy }) => {
    const { slippage } = (0, SlippageConfigProvider_1.useSlippageConfig)();
    const { form, jupiter: { refresh }, } = (0, SwapContext_1.useSwapContext)();
    const { delegationStrategy } = (0, DataProvider_1.useData)();
    return (<div className="mt-2 h-7 px-2 mb-4">
      <div className="w-full flex items-center justify-between ">
        <div className="flex space-x-1 items-center">
          {/* <button
          type="button"
          className="p-2 h-7 flex items-center justify-center border rounded-lg border-white/10 border-solid border-1 border-[#C8ECE1] text-[#4A5568]/30 fill-current"
          onClick={() => setShowStakeModeSettings(true)}
        >
          <span suppressHydrationWarning className="text-xs text-[#4A5568]">
            <TbDroplet className='inline'/> Liquid
          </span>
        </button> */}

          <button type="button" className="p-2 h-7 space-x-1 flex items-center justify-center border rounded-lg	border-white/10 border-solid border-1 border-[#C8ECE1] text-[#4A5568]/30 fill-current" onClick={() => setShowDelegationStrategy(true)}>
            <span suppressHydrationWarning className="text-xs text-[#4A5568]">
              <tb_1.TbSettingsAutomation className='inline'/> {delegationStrategy ? delegationStrategy.name : 'Automatic'}
            </span>
          </button>
        </div>
        <WalletComponents_1.WalletButton setIsWalletModalOpen={setIsWalletModalOpen}/>
      </div>
    </div>);
};
exports.default = Header;
