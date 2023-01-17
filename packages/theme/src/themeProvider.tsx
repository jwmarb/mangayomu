import React from 'react';
import { Theme } from '.';

const ThemeContext = React.createContext<Theme>({} as Theme);
export const useTheme = () => React.useContext(ThemeContext);

export interface ThemeProviderProps extends React.PropsWithChildren {
  theme: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  const { children, theme } = props;
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
