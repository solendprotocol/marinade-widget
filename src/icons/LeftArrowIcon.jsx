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
const React = __importStar(require("react"));
const LeftArrowIcon = ({ width = '12', height = '12' }) => {
    return (<svg width={width} height={height} viewBox="0 0 53 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.3336 23.8334H43.7062V28.1667H17.3336L28.9555 39.7887L25.8919 42.8524L9.03955 26L25.8919 9.14771L28.9555 12.2114L17.3336 23.8334Z" fill="currentColor"/>
    </svg>);
};
exports.default = LeftArrowIcon;
