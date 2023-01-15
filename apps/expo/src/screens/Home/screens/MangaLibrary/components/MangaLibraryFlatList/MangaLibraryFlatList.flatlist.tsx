import Manga from '@components/Manga';
import { AppState } from '@redux/store';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { connect, useSelector } from 'react-redux';
import styled, { css } from 'styled-components/native';

const Container = styled.View`
  ${(props) => css`
    margin: ${props.theme.spacing(1)};
  `}
`;

const mapStateToProps = (state: AppState, props: { mangaKey: string }) => ({
  manga: state.mangas[props.mangaKey],
});

const Item = connect(mapStateToProps)(
  React.memo<ReturnType<typeof mapStateToProps>>(({ manga }) => (
    <Container>
      <Manga {...manga} />
    </Container>
  ))
);

export const renderItem: ListRenderItem<string> = ({ item }) => <Item mangaKey={item} />;
export const keyExtractor = (key: string) => key;
