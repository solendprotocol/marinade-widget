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
const ValidatorIcon = ({ tokenInfo, width = 24, height = 24, }) => {
    const [error, setError] = (0, react_1.useState)(false);
    return (<div className="text-xs flex items-center justify-center rounded-full overflow-hidden" style={{ width, height }}>
      {tokenInfo && !error ? (<img onError={() => setError(true)} src={tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.logo} alt={tokenInfo === null || tokenInfo === void 0 ? void 0 : tokenInfo.name} width={width} height={height}/>) : (<div className="items-center justify-center rounded-full overflow-hidden bg-black/20" style={{ width, height }}/>)}
    </div>);
};
exports.default = ValidatorIcon;
