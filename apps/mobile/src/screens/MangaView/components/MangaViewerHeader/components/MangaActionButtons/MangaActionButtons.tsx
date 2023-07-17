import Box from '@components/Box';
import Button from '@components/Button';
import Icon from '@components/Icon';
import Progress from '@components/Progress';
import Stack from '@components/Stack';
import { useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import useRootNavigation from '@hooks/useRootNavigation';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { MangaActionButtonsProps } from './';

const buttonLoading = {
  disabled: true,
  icon: <Progress color="primary" size="small" />,
  variant: 'contained',
} as const;

const MangaActionButtons: React.FC<MangaActionButtonsProps> = (props) => {
  const {
    onBookmark,
    inLibrary,
    loading,
    mangaKey,
    currentlyReadingChapterKey,
    firstChapterKey,
  } = props;
  const navigation = useRootNavigation();
  const localRealm = useLocalRealm();
  function handleOnRead() {
    if (mangaKey != null && firstChapterKey != null)
      navigation.navigate('Reader', {
        chapter: currentlyReadingChapterKey ?? firstChapterKey,
        manga: mangaKey,
      });
  }
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
          onPress={handleOnRead}
          {...(loading
            ? buttonLoading
            : {
                label:
                  currentlyReadingChapterKey != null
                    ? localRealm.objectForPrimaryKey(
                        ChapterSchema,
                        currentlyReadingChapterKey,
                      )?.name
                    : 'Read',
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
