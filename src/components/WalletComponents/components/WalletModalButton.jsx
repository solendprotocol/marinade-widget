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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModalButton = void 0;
const react_1 = __importStar(require("react"));
const WalletPassthroughProvider_1 = require("src/contexts/WalletPassthroughProvider");
const WalletModalButton = ({ setIsWalletModalOpen }) => {
    const { connecting } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const handleClick = (0, react_1.useCallback)((event) => {
        setIsWalletModalOpen(true);
    }, []);
    return (<button type="button" className="py-2 px-3 h-7 flex items-center rounded-lg text-xs bg-[#EDF2F7] text-[#4A5568]" onClick={handleClick}>
      {connecting ? (<span>
          <span>Connecting...</span>
        </span>) : (<span>
          <span>Connect Wallet</span>
        </span>)}
    </button>);
};
exports.WalletModalButton = WalletModalButton;
