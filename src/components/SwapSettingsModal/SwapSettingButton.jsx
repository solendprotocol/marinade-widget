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
const react_1 = __importStar(require("react"));
const SwapSettingButton = ({ idx, itemsCount, className = '', onClick, highlighted, roundBorder, children, }) => {
    const classes = `relative flex-1 py-4 px-1 text-[#4A5568]/50 bg-[#1B1B1E]`;
    const roundBorderClass = (() => {
        if (roundBorder === 'left')
            return 'v2-border-gradient-left';
        if (roundBorder === 'right')
            return 'v2-border-gradient-right';
    })();
    const borderClassName = (0, react_1.useMemo)(() => {
        if (idx > 0 && idx < itemsCount)
            return 'border-l border-black/10 border-white/5';
    }, [idx, itemsCount]);
    return (<button type="button" className={`${highlighted ? `v2-border-gradient ${roundBorderClass} bg-v2-gradient bg-transparent` : ''} ${borderClassName} ${classes} ${className} relative`} onClick={onClick}>
      <div className={`h-full w-full leading-none flex justify-center items-center`}>{children}</div>
    </button>);
};
exports.default = SwapSettingButton;
