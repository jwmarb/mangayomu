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

const Manga: React.FC<MangaProps> = (props) => {
  const { title, link, imageCover } = props;
  const theme = useTheme();
  const navigation = useRootNavigation();
  function handleOnPress() {
    navigation.navigate('MangaViewer', { manga: props });
  }
  return (
    <ButtonBase onPress={handleOnPress} opacity>
      <MangaBaseContainer>
        <Flex direction='column'>
          <Image
            source={{ uri: imageCover }}
            style={{
              width: pixelToNumber(theme.spacing(13)),
              height: pixelToNumber(theme.spacing(20)),
              borderRadius: theme.borderRadius,
            }}
          />
          <Spacer y={1} />
          <Typography numberOfLines={2}>{title}</Typography>
        </Flex>
      </MangaBaseContainer>
    </ButtonBase>
  );
};

export default React.memo(Manga);
