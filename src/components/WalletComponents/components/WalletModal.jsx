"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModal = void 0;
const react_1 = __importDefault(require("react"));
const WalletListItem_1 = require("./WalletListItem");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const LeftArrowIcon_1 = __importDefault(require("src/icons/LeftArrowIcon"));
const PRIORITISE = {
    [wallet_adapter_base_1.WalletReadyState.Installed]: 1,
    [wallet_adapter_base_1.WalletReadyState.Loadable]: 2,
    [wallet_adapter_base_1.WalletReadyState.NotDetected]: 3,
    [wallet_adapter_base_1.WalletReadyState.Unsupported]: 3,
};
const WalletModal = ({ setIsWalletModalOpen }) => {
    const { wallets, select } = (0, wallet_adapter_react_1.useWallet)();
    const handleWalletClick = (event, wallet) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        try {
            // Might throw WalletReadyState.WalletNotReady
            select(wallet.name);
            if (wallet.readyState === wallet_adapter_base_1.WalletReadyState.NotDetected) {
                throw wallet_adapter_base_1.WalletReadyState.NotDetected;
            }
            setIsWalletModalOpen(false);
        }
        catch (error) {
            // TODO: A small toast or something to indicate the error
        }
    });
    const renderWalletList = (walletList, startKeyboardIndex = 0) => (<div className="h-full overflow-y-auto space-y-2 webkit-scrollbar" translate="no">
      {walletList.map((wallet, index) => {
            return (<ul key={index}>
            <WalletListItem_1.WalletListItem handleClick={(event) => handleWalletClick(event, wallet.adapter)} wallet={wallet.adapter}/>
          </ul>);
        })}
    </div>);
    return (<div className="flex flex-col h-full w-full py-4 px-2 bg-jupiter-bg">
      <div className="flex w-full justify-between">
        <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={() => setIsWalletModalOpen(false)}>
          <LeftArrowIcon_1.default width={24} height={24}/>
        </div>

        <div className="text-[#4A5568]">Connect Wallet</div>

        <div className=" w-6 h-6"/>
      </div>

      <div className="mt-7 overflow-auto">
        {renderWalletList(wallets.sort((a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState]))}
      </div>
    </div>);
};
exports.WalletModal = WalletModal;
