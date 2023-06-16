"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SexyChameleonText = ({ children, className }) => {
    const baseClass = 'text-white bg-clip-text';
    const classes = [baseClass, className].join(' ');
    return <span className={classes}>{children}</span>;
};
exports.default = SexyChameleonText;
