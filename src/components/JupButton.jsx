"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const JupButton = react_1.default.forwardRef(({ onClick, disabled, children, highlighted, className = '', size = 'md', type, bgClass, rounded }, ref) => {
    const contentClass = (() => {
        if (size === 'sm') {
            return 'px-4 py-2.5 text-xs';
        }
        if (size === 'md') {
            return 'px-4 py-3 text-sm font-semibold';
        }
        if (size === 'lg') {
            return 'p-5 text-md font-semibold';
        }
    })();
    const background = bgClass || 'text-[#4A5568] bg-[#EDF2F7] dark:bg-black/50';
    return (<button type={type} ref={ref} className={(0, classnames_1.default)({
            relative: true,
            'jup-gradient': highlighted,
            'opacity-50 cursor-not-allowed': disabled,
            [background]: true,
            [className]: true,
            [rounded || 'rounded-lg']: true,
        })} disabled={disabled} onClick={onClick}>
        <div className={`${contentClass} h-full w-full leading-none`}>{children}</div>
      </button>);
});
JupButton.displayName = 'JupButton';
exports.default = JupButton;
