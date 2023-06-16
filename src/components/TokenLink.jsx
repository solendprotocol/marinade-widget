"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const preferredExplorer_1 = require("src/contexts/preferredExplorer");
const ExternalIcon_1 = __importDefault(require("src/icons/ExternalIcon"));
const utils_1 = require("src/misc/utils");
const TokenLink = (({ tokenInfo }) => {
    const { getTokenExplorer } = (0, preferredExplorer_1.usePreferredExplorer)();
    return (<a target="_blank" rel="noreferrer" className="flex items-center bg-black/25 text-[#4A5568]/75 px-2 py-0.5 space-x-1 rounded cursor-pointer" href={getTokenExplorer(tokenInfo.address)} onClick={(e) => e.stopPropagation()}>
      <div className="text-xxs">{(0, utils_1.shortenAddress)(tokenInfo.address)}</div>
      <ExternalIcon_1.default />
    </a>);
});
TokenLink.displayName = 'TokenLink';
exports.default = TokenLink;
