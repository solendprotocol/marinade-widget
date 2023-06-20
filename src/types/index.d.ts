import { CSSProperties } from 'react';
import { Root } from 'react-dom/client';

import { Wallet } from '@solana/wallet-adapter-react';
import { PublicKey, TransactionError } from '@solana/web3.js';
import { SwapMode, SwapResult } from '@jup-ag/react-hook';

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

export type ThemeType = 'light' | 'dark' | 'auto';

export type DEFAULT_EXPLORER = 'Solana Explorer' | 'Solscan' | 'Solana Beach' | 'SolanaFM';

export type PaletteType = {
    // Light
    primaryLight: string,
    secondaryLight: string,
    primaryBgLight: string,
    secondaryBgLight: string,
    textLight: string,
    disabledTextLight: string,

    // Dark
    primaryDark: string,
    secondaryDark: string,
    primaryBgDark: string,
    secondaryBgDark: string,
    textDark: string,
    disabledTextDark: string,
}

export type PaletteInputType = {
  // Light
  primaryLight?: string,
  secondaryLight?: string,
  primaryBgLight?: string,
  secondaryBgLight?: string,
  textLight?: string,
  disabledTextLight?: string,

  // Dark
  primaryDark?: string,
  secondaryDark?: string,
  primaryBgDark?: string,
  secondaryBgDark?: string,
  textDark?: string,
  disabledTextDark?: string,
}

export interface IInit {
  endpoint: string;
  formProps?: FormProps;
  defaultExplorer?: DEFAULT_EXPLORER;
  theme?: ThemeType,
  palette?: PaletteInputType,
  
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
  onSwapError?: ({ error }: { error?: TransactionError }) => void;
  onSuccess?: ({ txid, swapResult }: { txid: string; swapResult: SwapResult }) => void;
  
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
  onSwapError: IInit['onSwapError'];
  onSuccess: IInit['onSuccess'];
}
