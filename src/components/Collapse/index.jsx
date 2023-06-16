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
const react_1 = __importStar(require("react"));
const Collapse = ({ children, className = '', height, maxHeight, expanded }) => {
    const [localHeight, setLocalHeight] = (0, react_1.useState)(height);
    (0, react_1.useEffect)(() => {
        if (expanded)
            setLocalHeight(maxHeight);
        else
            setLocalHeight(height);
    }, [height, maxHeight, expanded]);
    const animationClass = expanded ? 'animate-fade-in' : 'animate-fade-out';
    return (<div className={(0, classnames_1.default)('transition-all duration-200 overflow-hidden', animationClass, className)} style={{ height: localHeight, maxHeight }}>
      {children}
    </div>);
};
exports.default = Collapse;
