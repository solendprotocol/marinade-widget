"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const WalletDisconnectedGraphic_1 = __importDefault(require("src/icons/WalletDisconnectedGraphic"));
const ModalTerminal = (props) => {
    const { rpcUrl, formProps, fakeWallet, strictTokenList, defaultExplorer } = props;
    const launchTerminal = () => {
        window.Jupiter.init({
            endpoint: rpcUrl,
            formProps,
            passThroughWallet: fakeWallet,
            strictTokenList,
            defaultExplorer
        });
    };
    return (<div className="p-4 hover:bg-white/10 rounded-xl cursor-pointer flex h-full w-full flex-col items-center justify-center text-[#4A5568]" onClick={launchTerminal}>
      <WalletDisconnectedGraphic_1.default />
      <span className="text-xs mt-4">Launch Terminal Modal</span>
    </div>);
};
exports.default = ModalTerminal;
