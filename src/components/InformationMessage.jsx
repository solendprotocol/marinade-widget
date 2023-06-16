"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const InfoIconSVG_1 = __importDefault(require("src/icons/InfoIconSVG"));
const InformationMessage = ({ message, iconSize = 20, className, }) => {
    return (<div className={`md:px-6 mt-1 flex items-center text-xs fill-current text-black/50 dark:text-[#4A5568] font-semibold ${className}`}>
      <InfoIconSVG_1.default width={iconSize} height={iconSize}/>
      <span className="ml-2">{message}</span>
    </div>);
};
exports.default = InformationMessage;
