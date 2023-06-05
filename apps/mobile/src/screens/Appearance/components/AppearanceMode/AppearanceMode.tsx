import Radio from '@components/Radio';
import RadioGroup from '@components/RadioGroup';
import Stack from '@components/Stack';
import React from 'react';
import { AppearanceMode as Mode, useAppearanceMode } from '@theme/provider';

const AppearanceMode: React.FC = () => {
  const { setMode, mode } = useAppearanceMode();
  return (
    <RadioGroup onChange={setMode} value={mode}>
      <Stack flex-direction="row" space="s">
        <Radio value={Mode.SYSTEM} label="System (default)" />
        <Radio value={Mode.LIGHT} label="Light" />
        <Radio value={Mode.DARK} label="Dark" />
      </Stack>
    </RadioGroup>
  );
};

export default React.memo(AppearanceMode);
