"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const IconSwitchPairDark = () => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.04393 5.74021L12 3.3701L9.04393 1V2.68839H1.0228V4.05189H9.04393V5.74021ZM2.95607 5.34607L0 7.71617L2.95607 10.0863V8.39789H10.9772V7.03439H2.95607V5.34607Z" fill="white" fillOpacity="0.5"/>
  </svg>);
const SwitchPairButton = ({ className, onClick, disabled, }) => {
    return (<div className="flex justify-center">
      <div onClick={onClick} className={`border border-black/50 fill-current text-black bg-black/10 dark:text-[#4A5568]-35 dark:hover:text-[#4A5568]/50 dark:border dark:border-white-35 dark:hover:border-white/50 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        <div className="block -rotate-45">
          <IconSwitchPairDark />
        </div>
      </div>
    </div>);
};
exports.default = SwitchPairButton;
