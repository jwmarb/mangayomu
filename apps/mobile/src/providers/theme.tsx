import React from 'react';
import { useMMKVBoolean } from 'react-native-mmkv';
import { Theme, createTheme } from '@mangayomu/theme';
import { Appearance, StatusBar, useColorScheme } from 'react-native';
import {
  NavigationContainer,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { mmkv } from '@/utils/persist';

declare module '@mangayomu/theme' {
  export interface Theme extends Pick<DefaultTheme, 'mode'> {
    palette: DefaultTheme['palette'] & {
      skeleton: string;
      divider: string;
      common: {
        white: string;
        black: string;
      };
      action: {
        disabled: string;
        ripple: string;
        textInput: string;
      };
      status: {
        ongoing: string;
        hiatus: string;
        discontinued: string;
        completed: string;
      };
      success: {
        light: string;
        main: string;
        dark: string;
      };
    };
    helpers: ThemeHelpers;
    style: {
      rippleRadius: number;
      borderRadius: number;
      screen: {
        paddingVertical: number;
        paddingHorizontal: number;
      };
      container: {
        paddingVertical: number;
        paddingHorizontal: number;
      };
      size: {
        s: number;
        m: number;
        l: number;
        xl: number;
        xxl: number;
      };
    };
    reactNavigation: NavigationTheme;
  }
}

export type ThemeProviderProps = React.PropsWithChildren;

export const ThemeDarkModeContext = React.createContext<boolean>(
  Appearance.getColorScheme() === 'dark',
);
export const ThemeSetDarkModeContext = React.createContext<
  | ((
      value:
        | boolean
        | ((current: boolean | undefined) => boolean | undefined)
        | undefined,
    ) => void)
  | null
>(null);

export const { opposite: lightTheme, ...darkTheme } = createTheme<Theme>(
  ({ color, colorConstant }) => ({
    mode: 'dark' as const,
    helpers: {},
    palette: {
      skeleton: color('rgba(255, 255, 255, 0.12)', 'rgba(0, 0, 0, 0.12)'),
      divider: color('rgba(255, 255, 255, 0.12)', 'rgba(0, 0, 0, 0.12)'),
      common: {
        white: colorConstant('#fff'),
        black: colorConstant('#000'),
      },
      action: {
        ripple: color('#606060', '#484848'),
        disabled: color('rgba(255, 255, 255, 0.12)', 'rgba(0, 0, 0, 0.12)'),
        textInput: color('rgba(128, 128, 128, 0.12)', 'rgba(61, 61, 61, 0.12)'),
      },
      primary: {
        light: color('#B2CBE6', '#34A1FB'),
        main: color('#8DB1D8', '#1996FD'),
        dark: color('#6897CA', '#066EC4'),
      },
      secondary: {
        light: color('#DAA2B7', '#EC8F43'),
        main: color('#D290A9', '#E57417'),
        dark: color('#BA5B7F', '#B55D14'),
      },
      error: {
        main: color('#883934', '#e65252'),
        light: color('#e99090', '#e7a5a4'),
        dark: color('#553c3c', '#3b2020'),
      },
      success: {
        light: color('#d2f3c0', '#E1F7CF'),
        main: color('#71A057', '#b7eb8f'),
        dark: color('#3e4b36', '#72D129'),
      },
      warning: {
        main: color('#ed6c02', '#ffa726'),
        light: color('#ff9800', '#ffb74d'),
        dark: color('#e65100', '#f57c00'),
      },
      text: {
        primary: color('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.87)'),
        secondary: color('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.6)'),
        disabled: color('rgba(255, 255, 255, 0.3)', 'rgba(0, 0, 0, 0.26)'),
        hint: color('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.38)'),
      },
      background: {
        default: color('#071113', '#fafafa'),
        paper: color('#09181a', '#ffffff'),
        disabled: color('#102A2D', '#EFEFEF'),
      },
      status: {
        ongoing: color('#73d13d', '#b7eb8f'),
        hiatus: color('#ffc53d', '#ffe58f'),
        discontinued: color('#f5222d', '#ff7875'),
        completed: color('#434343', '#8c8c8c'),
      },
    },
    style: {
      rippleRadius: 16,
      borderRadius: 32,
      screen: {
        paddingVertical: (theme) => theme.style.size.s,
        paddingHorizontal: (theme) => theme.style.size.l,
      },
      container: {
        paddingVertical: (theme) => theme.style.size.s,
        paddingHorizontal: (theme) => theme.style.size.m,
      },
      size: {
        s: 4,
        m: 8,
        l: 12,
        xl: 16,
        xxl: 20,
      },
    },
    reactNavigation: {
      dark: (theme) => theme.mode === 'dark',
      colors: {
        background: (theme) => theme.palette.background.default,
        primary: (theme) => theme.palette.primary.main,
        text: (theme) => theme.palette.text.primary,
        border: (theme) => theme.palette.divider,
        card: (theme) => theme.palette.background.paper,
        notification: (theme) => theme.palette.secondary.main,
      },
    },
  }),
);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useMMKVBoolean('theme', mmkv);
  const systemPreference = useColorScheme();
  const isEffectivelyDarkMode = isDarkMode ?? systemPreference === 'dark';

  React.useEffect(() => {
    if (isEffectivelyDarkMode) StatusBar.setBarStyle('light-content');
    else StatusBar.setBarStyle('dark-content');
  }, [isEffectivelyDarkMode]);

  const navigationTheme = (isEffectivelyDarkMode ? darkTheme : lightTheme)
    .reactNavigation;

  return (
    <NavigationContainer theme={navigationTheme}>
      <ThemeDarkModeContext.Provider value={isEffectivelyDarkMode}>
        <ThemeSetDarkModeContext.Provider value={setIsDarkMode}>
          {children}
        </ThemeSetDarkModeContext.Provider>
      </ThemeDarkModeContext.Provider>
    </NavigationContainer>
  );
}
