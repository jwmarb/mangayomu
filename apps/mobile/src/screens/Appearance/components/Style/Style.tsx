import Radio from '@components/Radio';
import RadioGroup from '@components/RadioGroup';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import { StyleProps } from './Style.interfaces';

const Style: React.FC<StyleProps> = (props) => {
  const { setBookStyle, style } = props;
  return (
    <>
      <Text bold variant="header">
        Style
      </Text>
      <RadioGroup onChange={setBookStyle} value={style}>
        <Stack space="s" flex-direction="row">
          <Radio value={BookStyle.CLASSIC} label="Classic" />
          <Radio value={BookStyle.TACHIYOMI} label="Tachiyomi" />
          <Radio value={BookStyle.MANGAROCK} label="MangaRock" />
        </Stack>
      </RadioGroup>
      <Text color="textSecondary" variant="book-title">
        Choose a style that best fits your taste
      </Text>
    </>
  );
};

export default React.memo(Style);
