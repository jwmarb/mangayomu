import { AppState } from '@redux/store';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { StatusBar, Image, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components/native';
import React from 'react';
import IconButton from '../../IconButton';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { HoldItem } from 'react-native-hold-menu';

export const HeaderBaseContainer = styled.View`
  ${(props) => css`
    padding-top: ${
      StatusBar.currentHeight
        ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 2)
        : props.theme.spacing(2)
    };
    background-color: ${props.theme.palette.background.paper.get()};
    padding-horizontal: ${props.theme.spacing(3)};
    padding-bottom: ${props.theme.spacing(2)};
    height: ${
      StatusBar.currentHeight
        ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 8)
        : props.theme.spacing(8)
    }
    display: flex;
    flex-direction: row;
    align-items: center;
  `}
`;

export const MangaSource: React.FC = () => {
  const mangaSource = useSelector((state: AppState) => state.settings.selectedSource);
  const menuItems: MenuItemProps[] = React.useMemo(
    () => [
      {
        text: mangaSource.name,
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
          Linking.openURL(`https://${mangaSource.link}`);
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
      <IconButton icon={<Image source={{ uri: mangaSource.icon }} style={{ width: 24, height: 24 }} />} />
    </HoldItem>
  );
};
