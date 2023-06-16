"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_FORM_CONFIG = exports.SOL_MINT_TOKEN_INFO = exports.WRAPPED_SOL_MINT = exports.JUPITER_DEFAULT_RPC = void 0;
const web3_js_1 = require("@solana/web3.js");
exports.JUPITER_DEFAULT_RPC = process.env.NEXT_PUBLIC_JUPITER_DEFAULT_RPC || 'https://solend.rpcpool.com/a3e03ba77d5e870c8c694b19d61c';
exports.WRAPPED_SOL_MINT = new web3_js_1.PublicKey('So11111111111111111111111111111111111111112');
exports.SOL_MINT_TOKEN_INFO = {
    chainId: 101,
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Wrapped SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    tags: [],
    extensions: {
        website: 'https://solana.com/',
        serumV3Usdc: '9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT',
        serumV3Usdt: 'HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1',
        coingeckoId: 'solana',
    },
};
exports.INITIAL_FORM_CONFIG = Object.freeze({
    useWalletPassthrough: false,
    strictTokenList: true,
    defaultExplorer: 'Solana Explorer',
    theme: 'light',
    formProps: {
        initialAmount: '',
        fixedInputMint: false,
        fixedAmount: false,
    }
});
