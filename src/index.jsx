"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderJupiter = void 0;
const react_1 = __importDefault(require("react"));
const Jupiter_1 = __importDefault(require("./components/Jupiter"));
const ContextProvider_1 = require("./contexts/ContextProvider");
const ScreenProvider_1 = require("./contexts/ScreenProvider");
const DataProvider_1 = require("./contexts/DataProvider");
const TokenContextProvider_1 = require("./contexts/TokenContextProvider");
const WalletPassthroughProvider_1 = __importDefault(require("./contexts/WalletPassthroughProvider"));
const RenderJupiter = (props) => {
    return (<ContextProvider_1.ContextProvider {...props}>
      <WalletPassthroughProvider_1.default>
        <TokenContextProvider_1.TokenContextProvider {...props}>
          <ScreenProvider_1.ScreenProvider>
            <DataProvider_1.DataProvider {...props}>
              <Jupiter_1.default {...props}/>
            </DataProvider_1.DataProvider>
          </ScreenProvider_1.ScreenProvider>
        </TokenContextProvider_1.TokenContextProvider>
      </WalletPassthroughProvider_1.default>
    </ContextProvider_1.ContextProvider>);
};
exports.RenderJupiter = RenderJupiter;
