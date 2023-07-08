import { CSSProperties } from 'react';
import { Root } from 'react-dom/client';

import { Wallet } from '@solana/wallet-adapter-react';
import { TransactionError } from '@solana/web3.js';

declare global {
  interface Window {
    Marinade: MarinadeTerminal;
  }
}

export type WidgetPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
export type WidgetSize = 'sm' | 'default';

export interface FormProps {
  referralCode?: string;
  allowDirectStake?: boolean;
  initialValidator?: string;
}

export type AllowedStakeModeType = 'stake' | 'unstake' | 'both';

export type ThemeType = 'light' | 'dark' | 'auto';

export type DEFAULT_EXPLORER = 'Solana Explorer' | 'Solscan' | 'Solana Beach' | 'SolanaFM';

export type PaletteType = {
  // Light
  primaryLight: string;
  secondaryLight: string;
  primaryBgLight: string;
  secondaryBgLight: string;
  textLight: string;
  disabledTextLight: string;

  // Dark
  primaryDark: string;
  secondaryDark: string;
  primaryBgDark: string;
  secondaryBgDark: string;
  textDark: string;
  disabledTextDark: string;
};

export type PaletteInputType = {
  // Light
  primaryLight?: string;
  secondaryLight?: string;
  primaryBgLight?: string;
  secondaryBgLight?: string;
  textLight?: string;
  disabledTextLight?: string;

  // Dark
  primaryDark?: string;
  secondaryDark?: string;
  primaryBgDark?: string;
  secondaryBgDark?: string;
  textDark?: string;
  disabledTextDark?: string;
};

export interface IInit {
  endpoint: string;
  formProps?: FormProps;
  defaultExplorer?: DEFAULT_EXPLORER;
  stakeMode: AllowedStakeModeType;
  theme?: ThemeType;
  palette?: PaletteInputType;

  // Display & Styling
  displayMode?: 'modal' | 'integrated' | 'widget';
  integratedTargetId?: string;
  widgetStyle?: {
    position?: WidgetPosition;
    size?: WidgetSize;
  };
  containerStyles?: CSSProperties;
  containerClassName?: string;

  // Passthrough & Callbacks
  passThroughWallet?: Wallet | null;
  onStakeError?: ({ error }: { error?: TransactionError }) => void;
  onSuccess?: ({ txid }: { txid: string }) => void;

  // Internal resolves
  scriptDomain?: string;
}

export interface MarinadeTerminal {
  _instance: React.ReactNode;
  init: (props: IInit) => void;
  resume: () => void;
  close: () => void;
  root: Root | null;

  // Passthrough & Callbacks
  passThroughWallet: IInit['passThroughWallet'];
  onStakeError: IInit['onStakeError'];
  onSuccess: IInit['onSuccess'];
}
