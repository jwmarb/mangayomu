import ButtonBase from '@components/Button/ButtonBase';
import { GenreContainer } from '@components/Genre/Genre.base';
import { GenreProps } from '@components/Genre/Genre.interfaces';
import { Typography } from '@components/Typography';
import { useRootNavigation } from '@navigators/Root';
import { AppState } from '@redux/store';
import { useMangaSource } from '@services/scraper';
import MangaHost from '@services/scraper/scraper.abstract';
import { WithGenresFilter } from '@services/scraper/scraper.interfaces';
import FilterValidator from '@utils/FilterValidator';
import React from 'react';
import { useSelector } from 'react-redux';

const Genre: React.FC<GenreProps> = (props) => {
  const { genre } = props;
  const navigation = useRootNavigation();
  const source = useMangaSource();
  async function handleOnPress() {
    if (FilterValidator.isMangaHostWithFilters<WithGenresFilter>(source)) {
      navigation.navigate('GenericMangaList', { genre });
    }
  }
  return (
    <ButtonBase onPress={handleOnPress}>
      <GenreContainer>
        <Typography>{genre}</Typography>
      </GenreContainer>
    </ButtonBase>
  );
};

export default Genre;
