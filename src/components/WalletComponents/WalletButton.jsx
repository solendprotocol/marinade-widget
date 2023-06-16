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
exports.WalletButton = void 0;
const react_1 = __importStar(require("react"));
const ScreenProvider_1 = require("src/contexts/ScreenProvider");
const WalletPassthroughProvider_1 = require("src/contexts/WalletPassthroughProvider");
const utils_1 = require("src/misc/utils");
const CurrentUserBadge_1 = require("../CurrentUserBadge");
const WalletModalButton_1 = require("./components/WalletModalButton");
const WalletButton = ({ setIsWalletModalOpen }) => {
    const { publicKey, connected, connecting, disconnect } = (0, WalletPassthroughProvider_1.useWalletPassThrough)();
    const [active, setActive] = (0, react_1.useState)(false);
    const ref = (0, react_1.useRef)(null);
    const { screen } = (0, ScreenProvider_1.useScreenState)();
    const base58 = (0, react_1.useMemo)(() => publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58(), [publicKey]);
    const passThroughWallet = window.Jupiter.passThroughWallet;
    const onClickDisconnect = () => {
        setActive(false);
        disconnect();
    };
    const closePopup = () => {
        setActive(false);
    };
    (0, utils_1.useOutsideClick)(ref, closePopup);
    if ((!connected && !connecting) || !base58) {
        return <WalletModalButton_1.WalletModalButton setIsWalletModalOpen={setIsWalletModalOpen}/>;
    }
    return (<div className="cursor-pointer relative rounded-lg">
      <div onClick={() => setActive(!active)}>
        <CurrentUserBadge_1.CurrentUserBadge />
      </div>

      {screen === 'Initial' && Boolean(passThroughWallet) === false ? (<ul aria-label="dropdown-list" className={active
                ? 'absolute block top-10 right-0 text-sm bg-black rounded-lg p-2 text-white dark:bg-white dark:text-black'
                : 'hidden'} ref={ref} role="menu">
          <li onClick={onClickDisconnect} role="menuitem">
            <span>Disconnect</span>
          </li>
        </ul>) : null}
    </div>);
};
exports.WalletButton = WalletButton;
