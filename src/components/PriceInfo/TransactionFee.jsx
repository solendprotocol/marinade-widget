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
const Tooltip_1 = __importDefault(require("src/components/Tooltip"));
const utils_1 = require("src/misc/utils");
const TransactionFee = ({ feeInformation }) => {
    const feeText = (0, react_1.useMemo)(() => {
        if (feeInformation) {
            return utils_1.formatNumber.format((0, utils_1.fromLamports)(feeInformation.signatureFee, 9));
        }
        return '-';
    }, [feeInformation]);
    return (<div className="flex items-center justify-between text-xs">
      <div className="flex w-[50%] text-[#4A5568]/30">
        <span>Transaction Fee</span>
        <Tooltip_1.default content={<span>This is for Solana transaction fee</span>}>
          <span className="ml-1 cursor-pointer">[?]</span>
        </Tooltip_1.default>
      </div>
      <div className="text-[#4A5568]/30">{feeText} SOL</div>
    </div>);
};
exports.default = TransactionFee;
