import { useSelect } from 'react-cosmos/client';
import React from 'react';
import { StatusBar } from 'react-native';
import useIsDarkMode from '@/hooks/useIsDarkMode';

/**
 * Converts mode to contrast
 *
 * This hook allows you to select between 'dark', 'light', and 'system' modes using the `useSelect` hook from react-cosmos.
 * It also uses a custom hook, `useIsDarkMode`, to determine if the system is in dark mode.
 * Based on the selected mode and the system's dark mode status, it updates the StatusBar style accordingly.
 * Additionally, it returns a boolean value that represents whether high contrast should be used for components
 * that depend on this value for their theme settings.
 *
 * @returns {boolean | undefined} - Returns a boolean indicating whether high contrast should be used. If the conditions
 *                                 do not match any of the cases, it returns `undefined`.
 */
export default function useModeSelect(): boolean | undefined {
  // Use the `useSelect` hook from react-cosmos to select between 'dark', 'light', and 'system' modes
  const [mode] = useSelect('mode', {
    options: ['dark', 'light', 'system'],
  });

  // Use a custom hook to determine if the system is in dark mode
  const isDarkMode = useIsDarkMode();

  // Update the StatusBar style based on the selected mode and system's dark mode status
  React.useEffect(() => {
    switch (mode) {
      case 'dark':
        // Set the StatusBar style to light content for dark mode
        StatusBar.setBarStyle('light-content');
        break;
      case 'light':
        // Set the StatusBar style to dark content for light mode
        StatusBar.setBarStyle('dark-content');
        break;
      case 'system':
        // Set the StatusBar style based on the system's dark mode status
        if (isDarkMode) StatusBar.setBarStyle('light-content');
        else StatusBar.setBarStyle('dark-content');
        break;
    }
  }, [mode, isDarkMode]);

  // Determine the contrast value based on the selected mode and system's dark mode status
  if (isDarkMode && mode === 'dark') return false;

  if (isDarkMode && mode === 'light') return true;

  if (!isDarkMode && mode === 'dark') return true;

  if (!isDarkMode && mode === 'light') return false;
}
