import MangaComponent from '@components/Manga';
import { Manga } from '@services/scraper/scraper.interfaces';
import React from 'react';
import { ListRenderItem } from 'react-native';
import styled, { css } from 'styled-components/native';

const Container = styled.View`
  ${(props) => css`
    margin: ${props.theme.spacing(1)};
  `}
`;

const Item: React.FC<{ manga: Manga }> = React.memo(({ manga }) => {
  return (
    <Container>
      <MangaComponent {...manga} />
    </Container>
  );
});

export const renderItem: ListRenderItem<Manga> = ({ item }) => <Item manga={item} />;
export const keyExtractor = (key: Manga) => key.link;
