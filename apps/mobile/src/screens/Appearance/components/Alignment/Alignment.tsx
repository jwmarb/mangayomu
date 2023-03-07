import Radio from '@components/Radio';
import RadioGroup from '@components/RadioGroup';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { TitleAlignment } from '@redux/slices/settings';
import React from 'react';
import { AlignmentProps } from './Alignment.interfaces';

const Alignment: React.FC<AlignmentProps> = (props) => {
  const { setTitleAlignment, alignment } = props;
  return (
    <>
      <Text>Alignment</Text>
      <RadioGroup onChange={setTitleAlignment} value={alignment}>
        <Stack flex-direction="row" space="s">
          <Radio value={TitleAlignment.START} label="Left" />
          <Radio value={TitleAlignment.CENTER} label="Center" />
          <Radio value={TitleAlignment.END} label="Right" />
        </Stack>
      </RadioGroup>
    </>
  );
};

export default React.memo(Alignment);
