import Manga from '@components/Manga';
import { AppState } from '@redux/store';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components/native';

const Container = styled.View`
  ${(props) => css`
    margin: ${props.theme.spacing(1)};
  `}
`;

const Item: React.FC<{ mangaKey: string }> = React.memo(({ mangaKey }) => {
  const manga = useSelector((state: AppState) => state.mangas[mangaKey]);
  return (
    <Container>
      <Manga {...manga} />
    </Container>
  );
});

export const renderItem: ListRenderItem<string> = ({ item }) => <Item mangaKey={item} />;
export const keyExtractor = (key: string) => key;
