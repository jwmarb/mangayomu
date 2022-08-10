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
import connector, { ConnectedMangaProps } from '@components/Manga/Manga.redux';
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Color, Constants } from '@theme/core';
import Badge from '@components/Badge';

const Manga: React.FC<ConnectedMangaProps> = (props) => {
  const { title, imageCover, cols, bold, fontSize, coverStyle, link, source, newChapters } = props;
  const navigation = useRootNavigation();
  function handleOnPress() {
    navigation.navigate('MangaViewer', { manga: { imageCover, title, link, source } });
  }
  switch (coverStyle) {
    case MangaCoverStyles.MODERN:
      return (
        <TouchableWithoutFeedback onPress={handleOnPress}>
          <MangaBaseContainer cols={cols}>
            <Badge badge={newChapters} show={newChapters != null && newChapters !== 0}>
              <Cover uri={imageCover}>
                <Typography numberOfLines={2} fontSize={fontSize} bold={bold} color={Constants.GRAY[1]}>
                  {title}
                </Typography>
              </Cover>
            </Badge>
          </MangaBaseContainer>
        </TouchableWithoutFeedback>
      );
    case MangaCoverStyles.CLASSIC:
    default:
      return (
        <Badge badge={newChapters} show={newChapters != null && newChapters !== 0}>
          <ButtonBase onPress={handleOnPress} opacity square>
            <MangaBaseContainer cols={cols}>
              <Flex direction='column'>
                <Cover uri={imageCover} />
                <Spacer y={1} />
                <Typography numberOfLines={2} fontSize={fontSize} bold={bold}>
                  {title}
                </Typography>
              </Flex>
            </MangaBaseContainer>
          </ButtonBase>
        </Badge>
      );
  }
};

export default connector(React.memo(Manga));
