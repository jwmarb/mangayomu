const defaultTheme = require('tailwindcss/defaultTheme');
const path = require('path');

const primary = 'rgba(var(--color-primary) / <alpha-value>)';
const secondary = 'rgba(var(--color-secondary) / <alpha-value>)';
const error = 'rgba(var(--color-error) / <alpha-value>)';
const disabledBackground =
  'rgba(var(--background-color-disabled) / <alpha-value>)';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{jsx,tsx}', './app/components/**/*.{jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary,
        'primary-contrast': 'var(--color-primary-contrast)',
        'secondary-contrast': 'var(--color-secondary-contrast)',
        'error-contrast': 'var(--color-error-contrast)',
        secondary,
        error: 'rgba(var(--color-error) / <alpha-value>)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        hint: 'var(--color-hint)',
        disabled: 'var(--color-hint)',
        default: 'rgba(var(--background-color-default) / <alpha-value>)',
        paper: 'rgba(var(--background-color-paper) / <alpha-value>)',
      },
      backgroundColor: {
        default: 'rgba(var(--background-color-default) / <alpha-value>)',
        paper: 'rgba(var(--background-color-paper) / <alpha-value>)',
        disabled: disabledBackground,
        tag: 'var(--background-color-tag)',
        border: 'var(--border-color-default)',
        primary,
        secondary,
        hover: 'rgba(var(--action-hover) / 0.2)',
        pressed: 'rgba(var(--action-hover) / 0.5)',
        error,
      },
      borderColor: {
        primary,
        secondary,
        default: 'var(--border-color-default)',
      },
      ringColor: {
        primary,
        secondary,
        error,
      },
      outlineColor: {
        default: 'var(--border-color-default)',
        disabled: disabledBackground,
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
        disabled: disabledBackground,
      },
    },
  },
};
