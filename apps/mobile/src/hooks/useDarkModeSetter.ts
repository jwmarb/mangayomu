import React from 'react';
import { ThemeSetDarkModeContext } from '../providers/theme';

export default function useDarkModeSetter() {
  const context = React.useContext(ThemeSetDarkModeContext);
  if (context == null)
    throw new Error(
      'Tried to consume `ThemeDarkModeContext` when component is not a child of it',
    );

  return context;
}
