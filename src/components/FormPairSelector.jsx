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
exports.PAIR_ROW_HEIGHT = void 0;
const react_1 = __importStar(require("react"));
const react_window_1 = require("react-window");
const LeftArrowIcon_1 = __importDefault(require("src/icons/LeftArrowIcon"));
const FormPairRow_1 = __importDefault(require("./FormPairRow"));
const DataProvider_1 = require("src/contexts/DataProvider");
const FormAccountRow_1 = __importDefault(require("./FormAccountRow"));
exports.PAIR_ROW_HEIGHT = 72;
const SEARCH_BOX_HEIGHT = 56;
// eslint-disable-next-line react/display-name
const rowRenderer = (0, react_1.memo)((props) => {
    const { data, index, style } = props;
    const item = data.searchResult[index];
    return <FormPairRow_1.default key={item.address} item={item} style={style} onSubmit={data.onSubmit}/>;
}, react_window_1.areEqual);
const FormPairSelector = ({ onSubmit, tokenInfos, onClose, }) => {
    const { stakeAccounts, setTarget } = (0, DataProvider_1.useData)();
    const inputRef = (0, react_1.createRef)();
    (0, react_1.useEffect)(() => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, [inputRef]);
    const solAccount = tokenInfos.find(r => r.symbol === 'SOL');
    return (<div className="flex flex-col h-full w-full p-4">
      <div className="flex w-full justify-between">
        <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={onClose}>
          <LeftArrowIcon_1.default width={24} height={24}/>
        </div>

        <div className="text-[#4A5568] font-bold">Select token or stake account</div>

        <div className=" w-6 h-6"/>
      </div>
      <div className="mt-2 ![overflow:overlay]">
        {solAccount && <FormPairRow_1.default key='SOL' item={Object.assign(Object.assign({}, solAccount), { name: 'Solana' })} style={{}} onSubmit={() => {
                setTarget({
                    type: 'native',
                    amount: 0
                });
                onClose();
            }}/>}
        <span className='pl-2 text-xs text-[#4A5568] font-semibold mb-1'>
          Stake accounts
        </span>
        {stakeAccounts.map(r => <FormAccountRow_1.default key={r.address} item={r} style={{}} onSubmit={() => {
                setTarget({
                    type: 'stakeAccount',
                    stakeAccount: r,
                    amount: Number(r.balance)
                });
                onClose();
            }}/>)}
      </div>
    </div>);
};
exports.default = FormPairSelector;
