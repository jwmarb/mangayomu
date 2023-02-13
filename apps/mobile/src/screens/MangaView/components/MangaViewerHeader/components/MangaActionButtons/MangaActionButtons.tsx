import Box from '@components/Box';
import Button from '@components/Button';
import Icon from '@components/Icon';
import Progress from '@components/Progress';
import { Stack } from '@components/Stack';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { MangaActionButtonsProps } from './MangaActionButtons.interfaces';

const buttonLoading = {
  disabled: true,
  icon: <Progress color="primary" size="small" />,
  variant: 'contained',
} as const;

const MangaActionButtons: React.FC<MangaActionButtonsProps> = (props) => {
  const { onBookmark, inLibrary, loading } = props;
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
          {...(loading
            ? buttonLoading
            : {
                label: 'Read',
                variant: 'contained',
                icon: <Icon type="font" name="book" />,
              })}
        />
      </Box>
      <Box>
        <Button
          onPress={onBookmark}
          {...(loading
            ? buttonLoading
            : {
                label: inLibrary ? 'Remove' : 'Save',
                icon: (
                  <Icon
                    type="font"
                    name={!inLibrary ? 'bookmark' : 'bookmark-outline'}
                  />
                ),
                variant: inLibrary ? 'outline' : 'contained',
                color: 'secondary',
              })}
        />
      </Box>
    </Stack>
  );
};

export default React.memo(MangaActionButtons);
