import { useSelect } from 'react-cosmos/client';
import useIsDarkMode from '@/hooks/useIsDarkMode';

/**
 * Converts mode to contrast
 * @returns Returns a boolean for a component that uses a `contrast` so that its theme can be fixedly set.
 */
export default function useModeSelect(): boolean | undefined {
  const [mode] = useSelect('mode', {
    options: ['dark', 'light', 'system'],
  });
  const isDarkMode = useIsDarkMode();

  if (isDarkMode && mode === 'dark') return false;

  if (isDarkMode && mode === 'light') return true;

  if (!isDarkMode && mode === 'dark') return true;

  if (!isDarkMode && mode === 'light') return false;
}
