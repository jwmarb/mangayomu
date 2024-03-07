import { useSelect } from 'react-cosmos/client';
import React from 'react';
import useModeSelect from '@/hooks/useModeSelect';
import useIsDarkMode from '@/hooks/useIsDarkMode';

const mockedUseSelect = useSelect as jest.Mock;
const mockedUseIsDarkMode = useIsDarkMode as jest.Mock;

jest.mock('react-cosmos/client', () => ({
  useSelect: jest.fn(),
}));

jest.mock('@/hooks/useIsDarkMode', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// It is not necessary to change StatusBar in a testing environment like this
jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

test('uses system theme', () => {
  mockedUseIsDarkMode.mockReturnValue('dark');
  mockedUseSelect.mockReturnValue(['system']);

  expect(useModeSelect()).toEqual(undefined);

  mockedUseIsDarkMode.mockReturnValue('light');
  mockedUseSelect.mockReturnValue(['system']);

  expect(useModeSelect()).toEqual(undefined);
});

test('uses dark theme when device is light theme', () => {
  mockedUseIsDarkMode.mockReturnValue(false);
  mockedUseSelect.mockReturnValue(['dark']);

  expect(useModeSelect()).toEqual(true); // contrast true to get dark theme
});

test('uses light theme when device is light theme', () => {
  mockedUseIsDarkMode.mockReturnValue(false);
  mockedUseSelect.mockReturnValue(['light']);

  expect(useModeSelect()).toEqual(false); // contrast false to get light theme
});

test('uses light theme when device is dark theme', () => {
  mockedUseIsDarkMode.mockReturnValue(true);
  mockedUseSelect.mockReturnValue(['light']);

  expect(useModeSelect()).toEqual(true); // contrast true to get light theme
});

test('uses dark theme when device is dark theme', () => {
  mockedUseIsDarkMode.mockReturnValue(true);
  mockedUseSelect.mockReturnValue(['dark']);

  expect(useModeSelect()).toEqual(false); // contrast false to get dark theme
});
