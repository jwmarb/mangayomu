const defaultTheme = require('tailwindcss/defaultTheme');
const path = require('path');

const primary = 'rgba(var(--color-primary) / <alpha-value>)';
const secondary = 'rgba(var(--color-secondary) / <alpha-value>)';
const error = 'rgba(var(--color-error) / <alpha-value>)';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{jsx,tsx}', './app/components/**/*.{jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary,
      'primary-contrast': 'var(--color-primary-contrast)',
      'secondary-contrast': 'var(--color-secondary-contrast)',
      secondary,
      error: 'rgba(var(--color-error) / <alpha-value>)',
      'text-primary': 'var(--color-text-primary)',
      'text-secondary': 'var(--color-text-secondary)',
    },
    backgroundColor: {
      default: 'rgba(var(--background-color-default) / <alpha-value>)',
      paper: 'rgba(var(--background-color-paper) / <alpha-value>)',
      disabled: 'rgba(var(--background-color-disabled) / <alpha-value>)',
      primary,
      secondary,
    },
    borderColor: {
      primary,
      secondary,
      default: 'var(--border-color-default)',
    },
    ringColor: {
      primary,
      secondary,
    },
    outlineColor: {
      default: 'var(--border-color-default)',
      primary,
      secondary,
      error,
    },
    fontFamily: {
      sans: ['Nunito', ...defaultTheme.fontFamily.sans],
    },
    boxShadowColor: {
      primary,
      secondary,
    },
    extend: {},
  },
};
