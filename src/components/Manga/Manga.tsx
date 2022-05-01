import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import { MangaProps } from '@components/Manga/Manga.interface';
import { Typography } from '@components/Typography';
import { Image } from 'react-native';
import React from 'react';
import { useTheme } from 'styled-components/native';
import pixelToNumber from '@utils/pixelToNumber';
import { MangaBaseContainer } from '@components/Manga/Manga.base';
import Spacer from '@components/Spacer';
import { useRootNavigation } from '@navigators/Root';
import Cover from '@components/Manga/Cover/Cover';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';

const Manga: React.FC<MangaProps> = (props) => {
  const { title, imageCover, compact = false } = props;
  const navigation = useRootNavigation();
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  function handleOnPress() {
    navigation.navigate('MangaViewer', { manga: props });
  }
  return (
    <ButtonBase onPress={handleOnPress} opacity>
      <MangaBaseContainer cols={cols}>
        <Flex direction='column'>
          <Cover uri={imageCover} />
          <Spacer y={1} />
          <Typography numberOfLines={2}>{title}</Typography>
        </Flex>
      </MangaBaseContainer>
    </ButtonBase>
  );
};

export default React.memo(Manga);
