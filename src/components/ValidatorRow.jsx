"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAddress = void 0;
const react_1 = __importDefault(require("react"));
const FormPairSelector_1 = require("./FormPairSelector");
const ValidatorIcon_1 = __importDefault(require("./ValidatorIcon"));
const formatAddress = (address, length) => {
    return `${address.slice(0, length !== null && length !== void 0 ? length : 5)}...${address.slice(-(length !== null && length !== void 0 ? length : 5))}`;
};
exports.formatAddress = formatAddress;
const ValidatorRow = ({ item, style, onSubmit }) => {
    return (<li className={`cursor-pointer list-none `} style={Object.assign(Object.assign({ maxHeight: FormPairSelector_1.PAIR_ROW_HEIGHT, height: FormPairSelector_1.PAIR_ROW_HEIGHT }, style), { right: 0 })} translate="no">
      <div className="flex items-center rounded-lg space-x-4 my-2 p-3 justify-between hover:bg-black/10" onClick={() => onSubmit(item)}>
        <div className="flex-shrink-0">
          <div className="h-6 w-6 rounded-full">
            <ValidatorIcon_1.default tokenInfo={item} width={24} height={24}/>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className='flex flex-row space-x-2'>
            <p className="text-sm text-[#4A5568] truncate">
              {item.name}
            </p>
          </div>

          <div className="mt-1 text-xs text-gray-500 truncate flex space-x-1">
            {(0, exports.formatAddress)(item.address)}
          </div>
        </div>
      </div>
    </li>);
};
exports.default = ValidatorRow;
