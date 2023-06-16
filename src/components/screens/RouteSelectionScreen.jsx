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
exports.PADDING_TOP = exports.ROUTE_HEIGHT = void 0;
const react_1 = __importStar(require("react"));
const SwapContext_1 = require("src/contexts/SwapContext");
const LeftArrowIcon_1 = __importDefault(require("src/icons/LeftArrowIcon"));
const react_window_1 = require("react-window");
const react_window_2 = require("react-window");
const classnames_1 = __importDefault(require("classnames"));
const TokenContextProvider_1 = require("src/contexts/TokenContextProvider");
const utils_1 = require("src/misc/utils");
exports.ROUTE_HEIGHT = 64;
exports.PADDING_TOP = 18;
// eslint-disable-next-line react/display-name
const rowRenderer = (0, react_1.memo)((props) => {
    const { data, index, style } = props;
    const item = data.availableRoutes[index];
    const fromTokenInfo = data.fromTokenInfo;
    const toTokenInfo = data.toTokenInfo;
    const active = data.selectedSwapRoute == data.availableRoutes[index];
    const marketRoutes = item ? item.marketInfos.map(({ label }) => label).join(', ') : '';
    const className = active ? 'bg-jupiter-swap-gradient' : '';
    const onSubmit = () => data.onSubmit(item);
    return (<li className={`cursor-pointer list-none text-xs flex rounded-xl ${className}`} style={Object.assign(Object.assign({ maxHeight: exports.ROUTE_HEIGHT, height: exports.ROUTE_HEIGHT }, style), { top: Number(style.top) + 18 })} translate="no">
      {index === 0 && (<div className={`absolute px-2 py-1 font-semibold text-[#4A5568] p-0.5 bg-[#FBA43A]`} style={{ borderRadius: 4, left: 0, top: -14, fontSize: 11 }}>
          <span>Best price</span>
        </div>)}

      <div className={`flex items-center w-full justify-between rounded-xl space-x-4 m-0.5 p-4 bg-[#2C2D33] ${active ? '' : 'hover:bg-black/10'} `} onClick={onSubmit}>
        <div className="text-[#4A5568]/50 w-[50%]">{marketRoutes}</div>

        <div className="w-[50%] text-right">
          <p className="text-sm font-semibold text-[#4A5568] truncate">
            {data.swapMode === 'ExactOut' ?
            `${(0, utils_1.fromLamports)(item.inAmount, fromTokenInfo.decimals || 6)} ${fromTokenInfo.symbol}`
            : `${(0, utils_1.fromLamports)(item.outAmount, toTokenInfo.decimals || 6)} ${toTokenInfo.symbol}`}
          </p>
        </div>
      </div>
    </li>);
}, react_window_2.areEqual);
const RouteSelectionScreen = ({ onClose }) => {
    const { form: { fromMint, toMint }, selectedSwapRoute, setSelectedSwapRoute, formProps: { swapMode, }, jupiter: { routes }, } = (0, SwapContext_1.useSwapContext)();
    const onGoBack = () => {
        onClose();
    };
    const onSubmit = (route) => {
        setSelectedSwapRoute(route);
    };
    const { tokenMap } = (0, TokenContextProvider_1.useTokenContext)();
    const [fromTokenInfo, toTokenInfo] = (0, react_1.useMemo)(() => {
        return [
            fromMint ? tokenMap.get(fromMint) : null,
            toMint ? tokenMap.get(toMint) : null,
        ];
    }, [fromMint, toMint, tokenMap]);
    const listRef = (0, react_1.useRef)();
    const availableRoutes = (0, react_1.useMemo)(() => routes || [], [routes]);
    return (<div className="flex flex-col h-full w-full py-4 px-2">
      <div className="flex w-full justify-between">
        <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={onGoBack}>
          <LeftArrowIcon_1.default width={24} height={24}/>
        </div>

        <div className="text-[#4A5568]">Select Route</div>

        <div className=" w-6 h-6"/>
      </div>

      <p className="text-xs text-[#4A5568]/50 my-3">
        Jupiter automatically selects a route with the best price, however you can select a route manually.
      </p>

      <div className="mt-2 overflow-y-auto overflow-x-hidden webkit-scrollbar" style={{ flexGrow: 1 }}>
        {(availableRoutes || []).length > 0 ? (<react_window_1.VariableSizeList ref={listRef} height={availableRoutes.length * exports.ROUTE_HEIGHT + exports.PADDING_TOP} itemCount={availableRoutes.length} itemSize={() => exports.ROUTE_HEIGHT} width={'100%'} itemData={{
                availableRoutes,
                fromTokenInfo,
                toTokenInfo,
                selectedSwapRoute,
                onSubmit,
                swapMode,
            }} className={(0, classnames_1.default)('overflow-y-scroll mr-1 min-h-[12rem] webkit-scrollbar pt-4')}>
            {rowRenderer}
          </react_window_1.VariableSizeList>) : null}
      </div>
    </div>);
};
exports.default = RouteSelectionScreen;
