import React from 'react';
import { BookListItemProps } from './BookListItem.interfaces';
import { RectButton } from 'react-native-gesture-handler';
import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import { MANGA_LIST_ITEM_HEIGHT } from '@theme/constants';
import Stack from '@components/Stack';
import { StaticCover } from '@components/Cover';
import Text from '@components/Text';
import displayMessage from '@helpers/displayMessage';

const BookListItem: React.FC<BookListItemProps> = (props) => {
  const { manga, children, end, start, onPress } = props;
  const theme = useTheme();
  function handleOnLongPress() {
    displayMessage(manga.title);
  }
  return (
    <RectButton
      shouldCancelWhenOutside
      rippleColor={theme.palette.action.ripple}
      onLongPress={handleOnLongPress}
      onPress={onPress}
    >
      <Box
        px="m"
        py="s"
        height={MANGA_LIST_ITEM_HEIGHT}
        justify-content="center"
      >
        <Stack space="s" flex-direction="row" justify-content="space-between">
          {start}
          <Stack
            space="s"
            flex-direction="row"
            align-items="center"
            flex-shrink
          >
            <StaticCover manga={manga} />
            <Box align-self="center" flex-shrink>
              <Text bold variant="book-title" numberOfLines={2}>
                {manga.title}
              </Text>
              {children}
            </Box>
          </Stack>
          {end}
        </Stack>
      </Box>
    </RectButton>
  );
};

export default BookListItem;
