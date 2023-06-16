"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_syntax_highlighter_1 = __importDefault(require("react-syntax-highlighter"));
const hljs_1 = require("react-syntax-highlighter/dist/cjs/styles/hljs");
const classnames_1 = __importDefault(require("classnames"));
const constants_1 = require("src/constants");
const utils_1 = require("src/misc/utils");
function addInlinesToCode(code, insertLines) {
    let lines = code.split('\n');
    lines = [...lines.slice(0, lines.length - 1), insertLines, ...lines.slice(lines.length - 1, lines.length)];
    return lines.join('\n');
}
const CodeBlocks = ({ formConfigurator, displayMode, }) => {
    const USE_WALLET_SNIPPET = `import { useWallet } from '@solana/wallet-adapter-react';
const { wallet } = useWallet();
`;
    const DISPLAY_MODE_VALUES = (() => {
        if (displayMode === 'modal')
            return {};
        if (displayMode === 'integrated')
            return { displayMode: 'integrated', integratedTargetId: 'integrated-terminal' };
        if (displayMode === 'widget')
            return { displayMode: 'widget' };
    })();
    // Filter out the key that's not default
    const filteredFormProps = Object.keys(formConfigurator.formProps).reduce((acc, key) => {
        const itemKey = key;
        if (formConfigurator.formProps[itemKey] !== constants_1.INITIAL_FORM_CONFIG.formProps[itemKey]) {
            acc[itemKey] = formConfigurator.formProps[itemKey];
        }
        return acc;
    }, {});
    const valuesToFormat = Object.assign(Object.assign(Object.assign(Object.assign({}, DISPLAY_MODE_VALUES), { endpoint: 'https://api.mainnet-beta.solana.com' }), (formConfigurator.strictTokenList === false ? { strictTokenList: formConfigurator.strictTokenList } : undefined)), (formConfigurator.defaultExplorer !== 'Solana Explorer'
        ? { defaultExplorer: formConfigurator.defaultExplorer }
        : undefined));
    const formPropsSnippet = Object.keys(valuesToFormat).length > 0 ? JSON.stringify(valuesToFormat, null, 4) : '';
    const INIT_SNIPPET = `window.Marinade.init(${formPropsSnippet});`;
    let snippet = formConfigurator.useWalletPassthrough ? `${USE_WALLET_SNIPPET}${INIT_SNIPPET}` : INIT_SNIPPET;
    if (formConfigurator.useWalletPassthrough) {
        snippet = addInlinesToCode(snippet, `\t"passThroughWallet": wallet,`);
    }
    const [isCopied, setIsCopied] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }, [isCopied]);
    const copyToClipboard = () => {
        if (isCopied)
            return;
        navigator.clipboard.writeText(snippet);
        setIsCopied(true);
    };
    const [isCopiedShareLink, setIsCopiedShareLink] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setTimeout(() => {
            setIsCopiedShareLink(false);
        }, 2000);
    }, [isCopiedShareLink]);
    const copyShareLink = () => {
        if (typeof window === 'undefined')
            return;
        const stringifiedQuery = JSON.stringify((0, utils_1.jsonToBase64)(valuesToFormat));
        navigator.clipboard.writeText(`${window.location.origin}?import=${stringifiedQuery.replaceAll('"', '')}`);
        setIsCopiedShareLink(true);
    };
    return (<div className="flex flex-col items-center justify-center mt-12">
      <div className="relative w-full max-w-3xl overflow-hidden px-4 md:px-0">
        <p className="text-[#4A5568] self-start pb-2 font-semibold">Code snippet</p>

        <div className='absolute flex space-x-2 top-0 right-4 md:top-10 md:right-2 '>
          <button className={(0, classnames_1.default)('text-xs text-[#4A5568] border rounded-xl px-2 py-1 opacity-50 hover:opacity-100', isCopied ? 'opacity-100 cursor-wait' : '')} onClick={copyToClipboard}>
            {isCopied ? 'Copied!' : 'Copy to clipboard'}
          </button>

          <button className={(0, classnames_1.default)('text-xs text-[#4A5568] border rounded-xl px-2 py-1 opacity-50 hover:opacity-100', isCopiedShareLink ? 'opacity-100 cursor-wait' : '')} onClick={copyShareLink}>
            {isCopiedShareLink ? 'Copied share link!' : 'Share'}
          </button>
        </div>


        <react_syntax_highlighter_1.default language="typescript" showLineNumbers style={hljs_1.vs2015}>
          {snippet}
        </react_syntax_highlighter_1.default>
      </div>
    </div>);
};
exports.default = CodeBlocks;
