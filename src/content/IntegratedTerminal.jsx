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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const utils_1 = require("src/misc/utils");
const IntegratedTerminal = (props) => {
    const { rpcUrl, formProps, fakeWallet, strictTokenList, defaultExplorer } = props;
    const [isLoaded, setIsLoaded] = (0, react_1.useState)(false);
    const launchTerminal = () => __awaiter(void 0, void 0, void 0, function* () {
        window.Jupiter.init({
            displayMode: 'integrated',
            integratedTargetId: 'integrated-terminal',
            endpoint: rpcUrl,
            formProps,
            passThroughWallet: fakeWallet,
            strictTokenList,
            defaultExplorer,
        });
    });
    (0, react_1.useEffect)(() => {
        let intervalId = undefined;
        if (!isLoaded || !window.Jupiter.init) {
            intervalId = setInterval(() => {
                setIsLoaded(Boolean(window.Jupiter.init));
            }, 500);
        }
        if (intervalId) {
            return () => clearInterval(intervalId);
        }
    }, []);
    (0, utils_1.useDebouncedEffect)(() => {
        if (isLoaded && Boolean(window.Jupiter.init)) {
            launchTerminal();
        }
    }, [isLoaded, formProps, fakeWallet], 200);
    return (<div className="min-h-[600px] w-full rounded-2xl text-[#4A5568] flex flex-col items-center p-2 lg:p-4 mb-4 overflow-hidden mt-9">
      <div className="flex flex-col lg:flex-row h-full w-full overflow-auto">
        <div className="w-full h-full rounded-xl overflow-hidden flex justify-center">
          {/* Loading state */}
          {!isLoaded ? (<div className="h-full w-full animate-pulse bg-white/10 mt-4 lg:mt-0 lg:ml-4 flex items-center justify-center rounded-xl">
              <p className="">Loading...</p>
            </div>) : null}

          <div id="integrated-terminal" className={`flex h-full w-full max-w-[384px] overflow-auto justify-center bg-[#fff] rounded-xl ${!isLoaded ? 'hidden' : ''}`}/>
        </div>
      </div>
    </div>);
};
exports.default = IntegratedTerminal;
