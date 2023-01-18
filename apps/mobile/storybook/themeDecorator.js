import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { __storybook_theme__ } from '../src/theme';
const ThemeDecorator = (story) => (
  <ThemeProvider theme={__storybook_theme__}>{story()}</ThemeProvider>
);

export default ThemeDecorator;
