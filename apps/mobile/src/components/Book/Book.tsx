import { BookProps } from './';
import Cover from '@components/Cover';
import displayMessage from '@helpers/displayMessage';
import vibrate from '@helpers/vibrate';
import useMangaSource from '@hooks/useMangaSource';
import useRootNavigation from '@hooks/useRootNavigation';
import React from 'react';
import Flag from '@components/Book/Flag';
import BookPressableWrapper from '@components/Book/BookPressableWrapper';
import BookTitle from '@components/Book/BookTitle';
import CoverLayoutStyle from '@components/Book/CoverLayoutStyle';
import SourceIcon from '@components/Book/SourceIcon';
import NewChapterCounter from '@components/Book/NewChapterCounter';

function Book(props: BookProps) {
  const { manga } = props;

  const navigation = useRootNavigation();

  const source = useMangaSource(manga);

  function handleOnPress() {
    navigation.navigate('MangaView', manga);
  }
  function handleOnLongPress() {
    displayMessage(manga.title);
    vibrate();
  }

  return (
    <BookPressableWrapper
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
    >
      <Flag language={manga.language}>
        <NewChapterCounter manga={manga}>
          <SourceIcon iconUri={source.icon}>
            <Cover cover={manga} manga={manga}>
              <CoverLayoutStyle>
                <BookTitle title={manga.title} />
              </CoverLayoutStyle>
            </Cover>
          </SourceIcon>
        </NewChapterCounter>
      </Flag>
    </BookPressableWrapper>
  );
}

export default React.memo(Book);
