import React from 'react';
import { OverlayHeaderProps } from './OverlayHeader.interfaces';
import { OverlayHeaderContainer } from './OverlayHeader.base';
import { IconButton, Typography, Icon, Flex, Spacer, Button, MenuOption, Modal } from '@components/core';

const OverlayHeader: React.FC<OverlayHeaderProps> = (props) => {
  const { onBack, onBookmark, onOpen, inLibrary, manga, currentChapter } = props;
  return (
    <OverlayHeaderContainer>
      <Flex justifyContent='space-between' alignItems='center'>
        <IconButton icon={<Icon bundle='Feather' name='arrow-left' />} onPress={onBack} />
        <Flex>
          <IconButton
            onPress={onBookmark}
            icon={
              <Icon bundle='MaterialCommunityIcons' name={inLibrary ? 'bookmark-minus' : 'bookmark-plus-outline'} />
            }
          />
          <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='cog' />} onPress={onOpen} />
        </Flex>
      </Flex>
      <Spacer y={1} />
      <Flex direction='column'>
        <Typography numberOfLines={1}>{manga.title}</Typography>
        {currentChapter && (
          <Typography variant='body2' color='textSecondary'>
            {currentChapter?.name ?? `Chapter ${currentChapter.index}`}
          </Typography>
        )}
      </Flex>
    </OverlayHeaderContainer>
  );
};

export default React.memo(OverlayHeader);
