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
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importStar(require("react"));
const react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
const react_window_1 = require("react-window");
const LeftArrowIcon_1 = __importDefault(require("src/icons/LeftArrowIcon"));
const SearchIcon_1 = __importDefault(require("src/icons/SearchIcon"));
const accounts_1 = require("../contexts/accounts");
const ValidatorRow_1 = __importDefault(require("./ValidatorRow"));
const DataProvider_1 = require("src/contexts/DataProvider");
exports.PAIR_ROW_HEIGHT = 72;
const SEARCH_BOX_HEIGHT = 56;
// eslint-disable-next-line react/display-name
const rowRenderer = (0, react_1.memo)((props) => {
    const { data, index, style } = props;
    console.log(data);
    const item = data.searchResult[index];
    return <ValidatorRow_1.default key={item.address} item={item} style={style} onSubmit={data.onSubmit}/>;
}, react_window_1.areEqual);
const ValidatorSelector = ({ onSubmit, tokenInfos, onClose, }) => {
    const { accounts } = (0, accounts_1.useAccounts)();
    const { validators } = (0, DataProvider_1.useData)();
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [searchResult, setSearchResult] = (0, react_1.useState)(validators);
    (0, react_1.useEffect)(() => {
        const sortedList = validators
            .sort((a, b) => a.score > b.score ? -1 : 1);
        if (searchTerm) {
            const filteredList = sortedList.filter((item) => { var _a, _b; return item.address.includes(searchTerm) || item.voteAddress.includes(searchTerm) || ((_b = (_a = item.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes(searchTerm.toLowerCase())); });
            setSearchResult(filteredList);
        }
        else {
            setSearchResult(sortedList);
        }
    }, [accounts, tokenInfos, searchTerm]);
    const listRef = (0, react_1.createRef)();
    const inputRef = (0, react_1.createRef)();
    (0, react_1.useEffect)(() => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, [inputRef]);
    return (<div className="flex flex-col h-full w-full p-4">
      <div className="flex w-full justify-between">
      <div className="text-[#4A5568] fill-current w-6 h-6 cursor-pointer" onClick={onClose}>
        <LeftArrowIcon_1.default width={24} height={24}/>
      </div>

        <div className="text-[#4A5568] font-bold">Select a validator to direct stake</div>

        <div className=" w-6 h-6"/>
      </div>

      <div className="flex px-5 mt-4 w-[98%] rounded-lg border border-[#EDF2F7] border hover:border-[#EDF2F7]/90" style={{ height: SEARCH_BOX_HEIGHT, maxHeight: SEARCH_BOX_HEIGHT }}>

        <input autoComplete="off" className="w-full rounded-xl mr-4 truncate " placeholder={`Search by name/pubkey/vote address...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} ref={inputRef}/>
        <SearchIcon_1.default />
      </div>

      <div className="mt-2" style={{ flexGrow: 1 }}>
        {searchResult.length > 0 && (<react_virtualized_auto_sizer_1.default>
            {({ height, width }) => {
                return (<react_window_1.FixedSizeList ref={listRef} height={height} itemCount={searchResult.length} itemSize={exports.PAIR_ROW_HEIGHT} width={width - 2} // -2 for scrollbar
                 itemData={{
                        searchResult,
                        onSubmit,
                    }} className={(0, classnames_1.default)('overflow-y-scroll mr-1 min-h-[12rem] px-5 webkit-scrollbar')}>
                  {rowRenderer}
                </react_window_1.FixedSizeList>);
            }}
          </react_virtualized_auto_sizer_1.default>)}

        {searchResult.length === 0 ? (<div className="mt-4 mb-4 text-center text-white/50">
            <span>No tokens found</span>
          </div>) : (<></>)}
      </div>
    </div>);
};
exports.default = ValidatorSelector;
