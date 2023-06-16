"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const CloseIcon_1 = __importDefault(require("src/icons/CloseIcon"));
const ExternalIcon_1 = __importDefault(require("src/icons/ExternalIcon"));
const preferredExplorer_1 = require("src/contexts/preferredExplorer");
const TokenIcon_1 = __importDefault(require("../TokenIcon"));
const utils_1 = require("src/misc/utils");
const UNKNOWN_TOKEN_LINK = 'https://docs.jup.ag/notes/getting-your-token-on-jupiter';
const UnknownTokenModal = ({ tokensInfo, onClickAccept, onClickReject }) => {
    const { getTokenExplorer } = (0, preferredExplorer_1.usePreferredExplorer)();
    return (<div className="p-6 rounded-lg bg-jupiter-bg text-[#4A5568] max-h-[80vh] overflow-auto">
      {/* Token */}
      <div className="flex justify-between">
        <div />

        <div className="flex space-x-6 w-full justify-center">
          {tokensInfo.map((tokenInfo) => (<div key={tokenInfo.address} className="flex flex-col items-center justify-center">
              <TokenIcon_1.default tokenInfo={tokenInfo} width={52} height={52}/>
              <div className="mt-2 font-semibold">{tokenInfo.symbol}</div>

              <a href={getTokenExplorer(tokenInfo.address, 'mainnet-beta')} target="_blank" rel="nofollow noreferrer" className="mt-1 flex justify-center items-center rounded-lg py-1 px-2 bg-black-10 bg-black/30 cursor-pointer text-[#4A5568]/40 fill-current">
                <span className="mr-2 text-xxs">{(0, utils_1.shortenAddress)(tokenInfo.address)}</span>
                <ExternalIcon_1.default />
              </a>
            </div>))}
        </div>

        {/* Close Icon */}
        <div className="mt-2 fill-current text-[#4A5568]-35 cursor-pointer" onClick={onClickReject}>
          <CloseIcon_1.default width={16} height={16}/>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 text-sm text-[#4A5568] ">
        <div>
          {tokensInfo.length > 1
            ? ('These tokens are not on the strict list, make sure that the mint addresses are correct before confirming.')
            : ('This token is not on the strict list, make sure the mint address is correct before confirming')}
        </div>

        <a href={UNKNOWN_TOKEN_LINK} target="_blank" rel="noreferrer" className="mt-4 flex justify-center items-center text-[#4A5568]/40">
          <span>
            Learn More
          </span>

          <div className="ml-1 flex items-center fill-current">
            <ExternalIcon_1.default />
          </div>
        </a>
      </div>

      {/* Button */}
      <div className="w-full space-y-3 lg:space-y-0 lg:space-x-3 mt-7">
        <button type="button" className="bg-black text-[#4A5568] rounded-lg w-full py-2.5 px-6 font-semibold text-sm" onClick={onClickAccept}>
          <span>{'Confirm Selection'}</span>
        </button>
      </div>
    </div>);
};
exports.default = UnknownTokenModal;
