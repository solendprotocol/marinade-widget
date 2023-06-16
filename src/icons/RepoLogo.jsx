"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const RepoLogo = ({ width = '20', height = '20' }) => {
    return (<svg width={width} height={height} viewBox="0 0 20 21" fill="inherit" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.6667 18.8333H3.33333C3.11232 18.8333 2.90036 18.7455 2.74408 18.5892C2.5878 18.433 2.5 18.221 2.5 18V2.99999C2.5 2.77898 2.5878 2.56701 2.74408 2.41073C2.90036 2.25445 3.11232 2.16666 3.33333 2.16666H16.6667C16.8877 2.16666 17.0996 2.25445 17.2559 2.41073C17.4122 2.56701 17.5 2.77898 17.5 2.99999V18C17.5 18.221 17.4122 18.433 17.2559 18.5892C17.0996 18.7455 16.8877 18.8333 16.6667 18.8333ZM15.8333 17.1667V3.83332H4.16667V17.1667H15.8333ZM6.66667 6.33332H13.3333V7.99999H6.66667V6.33332ZM6.66667 9.66666H13.3333V11.3333H6.66667V9.66666ZM6.66667 13H10.8333V14.6667H6.66667V13Z" fill="inherit"/>
    </svg>);
};
exports.default = RepoLogo;
