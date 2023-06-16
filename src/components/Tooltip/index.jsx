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
const classnames_1 = __importDefault(require("classnames"));
const React = __importStar(require("react"));
const Tooltip = ({ className, content, disabled = false, variant = 'light', onClick, children, }) => {
    return (<div className="group cursor-pointer" onClick={onClick}>
      <div className={(0, classnames_1.default)('invisible absolute rounded shadow-lg py-1 px-2 right-0 w-full -mt-8 flex justify-center items-center text-center', className, {
            'bg-white text-black': variant === 'light',
            'bg-black text-[#4A5568]': variant === 'dark',
            'group-hover:visible group-hover:z-50': !disabled,
        })}>
        {content}
      </div>
      {children}
    </div>);
};
exports.default = Tooltip;
