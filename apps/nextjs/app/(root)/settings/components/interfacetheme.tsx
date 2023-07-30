import ThemePreview from '@app/(root)/settings/components/themepreview';
import Text from '@app/components/Text';
import { useDarkMode } from '@app/context/darkmode';
import React from 'react';

export default function InterfaceTheme() {
  const theme = useDarkMode((s) => s.theme);
  return (
    <>
      <div className="mx-4">
        <Text variant="header">Interface theme</Text>
        <Text color="text-secondary">
          Change the appearance of the application
        </Text>
      </div>
      <div className="flex gap-4 overflow-x-auto md:flex-wrap px-4 py-2">
        <ThemePreview
          value={null}
          title="System"
          default
          selected={theme == null}
        />
        <ThemePreview value="dark" title="Dark" selected={theme === 'dark'} />
        <ThemePreview
          title="Light"
          selected={theme === 'light'}
          value="light"
        />
      </div>
    </>
  );
}
