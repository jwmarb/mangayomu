import Box from '@components/Box';
import Button from '@components/Button';
import Icon from '@components/Icon';
import { Stack } from '@components/Stack';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { MangaActionButtonsProps } from './MangaActionButtons.interfaces';

const MangaActionButtons: React.FC<MangaActionButtonsProps> = (props) => {
  const { onBookmark, inLibrary } = props;
  return (
    <Stack
      space="s"
      align-items="center"
      px="m"
      flex-direction="row"
      mb="l"
      justify-content="center"
    >
      <Box maxWidth={moderateScale(480)} flex-grow>
        <Button
          icon={<Icon type="font" name="book-outline" />}
          label="Read"
          variant="contained"
        />
      </Box>
      <Box>
        <Button
          onPress={onBookmark}
          icon={
            <Icon
              type="font"
              name={!inLibrary ? 'bookmark' : 'bookmark-outline'}
            />
          }
          label={inLibrary ? 'Remove' : 'Save'}
          variant={inLibrary ? 'outline' : 'contained'}
          color="secondary"
        />
      </Box>
    </Stack>
  );
};

export default React.memo(MangaActionButtons);
