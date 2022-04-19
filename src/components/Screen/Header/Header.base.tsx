import { AppState } from '@redux/store';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { StatusBar, Image, Linking, View, ViewProps } from 'react-native';
import { useSelector } from 'react-redux';
import styled, { css, DefaultTheme } from 'styled-components/native';
import React from 'react';
import IconButton from '../../IconButton';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { HoldItem } from 'react-native-hold-menu';
import { ThemedStyledProps } from 'styled-components';
import { useMangaSource } from '@services/scraper';
import { ContainerProps } from '@components/Container/Container.interfaces';

const generateCSS = (props: ThemedStyledProps<ViewProps & React.RefAttributes<View>, DefaultTheme>) => css`
height: ${
  StatusBar.currentHeight ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 8) : props.theme.spacing(8)
}
display: flex;
flex-direction: row;
align-items: center;
`;

export const HeaderBuilder = styled.View<ContainerProps & { paper?: boolean }>`
  ${generateCSS}
  ${(props) => css`
    background-color: ${props.paper
      ? props.theme.palette.background.paper.get()
      : props.theme.palette.background.default.get()};
    padding-horizontal: ${typeof props.horizontalPadding === 'number'
      ? props.theme.spacing(props.horizontalPadding ?? 3)
      : props.theme.spacing(props.horizontalPadding ? 3 : 0)};
    padding-bottom: ${typeof props.verticalPadding === 'number'
      ? props.theme.spacing(props.verticalPadding ?? 2)
      : props.theme.spacing(props.verticalPadding ? 2 : 0)};
    padding-top: ${() => {
      switch (typeof props.verticalPadding) {
        default:
        case 'boolean':
          if (props.verticalPadding)
            return StatusBar.currentHeight
              ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 2)
              : props.theme.spacing(2);
          else return StatusBar.currentHeight ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER) : '0px';
        case 'number':
          return StatusBar.currentHeight
            ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + (props.verticalPadding ?? 2))
            : props.theme.spacing(props.verticalPadding ?? 2);
      }
    }};
  `}
`;

export const HeaderBaseContainer = styled.View`
  ${generateCSS}
  ${(props) => css`
    background-color: ${props.theme.palette.background.paper.get()};
    padding-horizontal: ${props.theme.spacing(3)};
    padding-bottom: ${props.theme.spacing(2)};
    padding-top: ${StatusBar.currentHeight
      ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 2)
      : props.theme.spacing(2)};
  `}
`;

export const MangaSource: React.FC = () => {
  const mangaSource = useMangaSource();
  const menuItems: MenuItemProps[] = React.useMemo(
    () => [
      {
        text: mangaSource.getName(),
        isTitle: true,
        withSeparator: true,
      },
      {
        text: 'Change Source',
        onPress: () => {},
        icon: 'book-open',
      },
      {
        text: 'View Website',
        onPress: () => {
          Linking.openURL(`https://${mangaSource.getLink()}`);
        },
        icon: 'link',
      },
      {
        text: 'Report Source',
        isDestructive: true,
        icon: 'flag',
      },
    ],
    [mangaSource]
  );
  return (
    <HoldItem activateOn='tap' hapticFeedback='Heavy' items={menuItems}>
      <IconButton icon={<Image source={{ uri: mangaSource.getIcon() }} style={{ width: 24, height: 24 }} />} />
    </HoldItem>
  );
};
