import { createContext, FC, ReactNode, useContext } from 'react';
import { IInit, PaletteType } from 'src/types';
import { useMediaQuery } from 'react-responsive';
import { INITIAL_FORM_CONFIG } from 'src/constants';

type AppPaletteType = {
  primary: string;
  secondary: string;
  primaryBg: string;
  secondaryBg: string;
  text: string;
  disabledText: string;
  invertedText: string;
  invertedPrimaryBg: string;
};

type ThemeType = {
  palette: AppPaletteType;
  colors: PaletteType;
};

const defaultContextValues = {
  palette: {
    primary: INITIAL_FORM_CONFIG.palette.primaryLight,
    secondary: INITIAL_FORM_CONFIG.palette.secondaryLight,
    primaryBg: INITIAL_FORM_CONFIG.palette.primaryBgLight,
    secondaryBg: INITIAL_FORM_CONFIG.palette.secondaryBgLight,
    text: INITIAL_FORM_CONFIG.palette.textLight,
    disabledText: INITIAL_FORM_CONFIG.palette.disabledTextLight,
    invertedText: INITIAL_FORM_CONFIG.palette.textDark,
    invertedPrimaryBg: INITIAL_FORM_CONFIG.palette.primaryBgDark,
  },
  colors: INITIAL_FORM_CONFIG.palette,
};

export const ThemeContext = createContext<ThemeType>(defaultContextValues);

export function useTheme(): ThemeType {
  return useContext(ThemeContext);
}

export const ThemeProvider: FC<IInit & { children: ReactNode }> = ({ formProps, children, palette, theme }) => {
  const systemPrefersDark = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });
  const usedPalette = {
    ...INITIAL_FORM_CONFIG.palette,
    ...palette,
  };

  const darkSet = {
    primary: usedPalette.primaryDark,
    secondary: usedPalette.secondaryDark,
    primaryBg: usedPalette.primaryBgDark,
    secondaryBg: usedPalette.secondaryBgDark,
    text: usedPalette.textDark,
    disabledText: usedPalette.disabledTextDark,
    invertedText: usedPalette.textLight,
    invertedPrimaryBg: usedPalette.primaryBgLight,
  };

  const lightSet = {
    primary: usedPalette.primaryLight,
    secondary: usedPalette.secondaryLight,
    primaryBg: usedPalette.primaryBgLight,
    secondaryBg: usedPalette.secondaryBgLight,
    text: usedPalette.textLight,
    disabledText: usedPalette.disabledTextLight,
    invertedText: usedPalette.textDark,
    invertedPrimaryBg: usedPalette.primaryBgDark,
  };

  let appPalette = systemPrefersDark ? darkSet : lightSet;

  if (theme === 'light') {
    appPalette = lightSet;
  } else if (theme === 'dark') {
    appPalette = darkSet;
  }
  return (
    <ThemeContext.Provider
      value={{
        palette: appPalette,
        // full palette
        colors: usedPalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
