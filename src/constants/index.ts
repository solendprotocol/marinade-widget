import { PublicKey } from '@solana/web3.js';
import { AllowedStakeModeType, DEFAULT_EXPLORER, FormProps, PaletteType, ThemeType } from 'src/types';

export const JUPITER_DEFAULT_RPC =
  process.env.NEXT_PUBLIC_JUPITER_DEFAULT_RPC || 'https://solend.rpcpool.com/a3e03ba77d5e870c8c694b19d61c';

export const WRAPPED_SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');
export const SOL_MINT_TOKEN_INFO = {
  chainId: 101,
  address: 'So11111111111111111111111111111111111111112',
  symbol: 'SOL',
  name: 'Wrapped SOL',
  decimals: 9,
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  tags: [],
  extensions: {
    website: 'https://solana.com/',
    serumV3Usdc: '9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT',
    serumV3Usdt: 'HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1',
    coingeckoId: 'solana',
  },
};

export interface IFormConfigurator {
  useWalletPassthrough: boolean;
  defaultExplorer: DEFAULT_EXPLORER;
  allowDirectStake?: boolean;
  formProps: FormProps;
  theme: ThemeType;
  stakeMode: AllowedStakeModeType;
  palette: PaletteType;
}

export const COLOR_PALETTE = {
  darkText: '#4A5568',
};

export const INITIAL_FORM_CONFIG: IFormConfigurator = Object.freeze({
  useWalletPassthrough: false,
  defaultExplorer: 'Solana Explorer',
  stakeMode: 'both',
  theme: 'light',
  formProps: {
    referralCode: '',
    allowDirectStake: true,
    fixedInputMint: false,
  },
  palette: {
    // Light
    primaryLight: '#308D8A',
    secondaryLight: '#EDF2F7',
    primaryBgLight: '#FFFFFF',
    secondaryBgLight: '#F7FAFC',
    textLight: '#171923',
    disabledTextLight: '#718096',

    // Dark
    primaryDark: '#08B898',
    secondaryDark: '#4A5568',
    primaryBgDark: '#242731',
    secondaryBgDark: '#353841',
    textDark: '#A0AEC0',
    disabledTextDark: '#4A5568',
  },
});
