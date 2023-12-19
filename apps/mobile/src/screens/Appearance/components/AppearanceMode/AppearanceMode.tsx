import Stack from '@components/Stack';
import React from 'react';
import {
  AppearanceMode as Mode,
  useAppearanceMode,
} from '@theme/appearanceprovider';
import { useTheme } from '@emotion/react';
import { ScrollView } from 'react-native-gesture-handler';
import AppearanceModePreview from '@screens/Appearance/components/AppearanceMode/components/AppearanceModePreview/AppearanceModePreview';
import { useColorScheme } from 'react-native';

const AppearanceMode: React.FC = () => {
  const { setMode, mode } = useAppearanceMode();
  const theme = useTheme();
  const systemMode = useColorScheme();
  const themes = React.useMemo(
    () => ({
      light: theme.mode === 'light' ? theme : theme.opposite,
      dark: theme.mode === 'dark' ? theme : theme.opposite,
    }),
    [],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Stack flex-direction="row" space="s">
        {systemMode && (
          <AppearanceModePreview
            mode={Mode.SYSTEM}
            setMode={setMode}
            theme={themes[systemMode]}
            isSelected={mode === Mode.SYSTEM}
          />
        )}
        <AppearanceModePreview
          mode={Mode.DARK}
          setMode={setMode}
          theme={themes.dark}
          isSelected={mode === Mode.DARK}
        />
        <AppearanceModePreview
          mode={Mode.LIGHT}
          setMode={setMode}
          theme={themes.light}
          isSelected={mode === Mode.LIGHT}
        />
      </Stack>
    </ScrollView>
  );
};

export default React.memo(AppearanceMode);
