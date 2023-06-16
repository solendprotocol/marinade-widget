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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importStar(require("react"));
const JupButton_1 = __importDefault(require("src/components/JupButton"));
const LeftArrowIcon_1 = __importDefault(require("src/icons/LeftArrowIcon"));
const utils_1 = require("src/misc/utils");
const WidgetTerminal = (props) => {
    const { rpcUrl, fakeWallet, formProps, strictTokenList, defaultExplorer } = props;
    const [isLoaded, setIsLoaded] = (0, react_1.useState)(false);
    const [position, setPosition] = (0, react_1.useState)('bottom-right');
    const [size, setSize] = (0, react_1.useState)('default');
    const launchTerminal = () => {
        window.Jupiter.init({
            displayMode: 'widget',
            widgetStyle: {
                position,
                size,
            },
            formProps,
            passThroughWallet: fakeWallet,
            endpoint: rpcUrl,
            strictTokenList,
            defaultExplorer
        });
    };
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
    }, [isLoaded, props, position, size], 1000);
    return (<div className="flex flex-col items-center">
      <div className="flex mt-9 px-2 md:px-0">
        <div>
          <div className="relative mt-8 md:mt-0">
            <div className="bg-white/10 rounded-xl flex items-center justify-center w-full md:w-[384px] h-[216px]">
              <span className="text-xs text-[#4A5568]/50 text-center w-[70%]">
                Click on the arrows to see how the Jupiter Widget will appear on your web browser.
                <br />
                Click on the logo to view the Jupiter Swap Modal.
              </span>

              {/* Top left  */}
              <div className={(0, classnames_1.default)('absolute left-1 top-1 cursor-pointer hover:bg-black/20 rounded-full p-1', {
            'jup-gradient': position === 'top-left',
        })} onClick={() => setPosition('top-left')}>
                <div className="rotate-45">
                  <LeftArrowIcon_1.default width={24} height={24}/>
                </div>
              </div>

              {/* Top right  */}
              <div className={(0, classnames_1.default)('absolute right-1 top-1 cursor-pointer hover:bg-black/20 rounded-full p-1', {
            'jup-gradient': position === 'top-right',
        })} onClick={() => setPosition('top-right')}>
                <div className="rotate-[135deg]">
                  <LeftArrowIcon_1.default width={24} height={24}/>
                </div>
              </div>

              {/* Bottom left  */}
              <div className={(0, classnames_1.default)('absolute left-1 bottom-1 cursor-pointer hover:bg-black/20 rounded-full p-1', {
            'jup-gradient': position === 'bottom-left',
        })} onClick={() => setPosition('bottom-left')}>
                <div className="-rotate-45">
                  <LeftArrowIcon_1.default width={24} height={24}/>
                </div>
              </div>

              {/* Bottom right  */}
              <div className={(0, classnames_1.default)('absolute right-1 bottom-1 cursor-pointer hover:bg-black/20 rounded-full p-1', {
            'jup-gradient': position === 'bottom-right',
        })} onClick={() => setPosition('bottom-right')}>
                <div className="rotate-[225deg]">
                  <LeftArrowIcon_1.default width={24} height={24}/>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Set Size</span>

            <div className="space-x-2 p-1.5 mt-2 bg-black/30 rounded-xl">
              <JupButton_1.default size="sm" onClick={() => {
            setSize('sm');
        }} type="button" className={size === 'sm' ? 'bg-white/10' : 'opacity-20 hover:opacity-70'}>
                <div className="flex items-center space-x-2 text-xs">
                  <div>Small</div>
                </div>
              </JupButton_1.default>
              <JupButton_1.default size="sm" onClick={() => {
            setSize('default');
        }} type="button" className={size === 'default' ? 'bg-white/10' : 'opacity-20 hover:opacity-70'}>
                <div className="flex items-center space-x-2 text-xs">
                  <div>Default</div>
                </div>
              </JupButton_1.default>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 py-4">
        <div className="border-b border-white/10"/>
      </div>
    </div>);
};
exports.default = WidgetTerminal;
