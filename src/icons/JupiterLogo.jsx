"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const JupiterLogo = ({ width = 24, height = 24 }) => {
    return <img src={'https://jup.ag/svg/jupiter-logo.svg'} width={width} height={height} alt="Jupiter aggregator"/>;
};
exports.default = JupiterLogo;
