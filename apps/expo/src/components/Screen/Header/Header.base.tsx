import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { StatusBar, Image, Linking, View, ViewProps } from 'react-native';
import styled, { css, DefaultTheme, useTheme } from 'styled-components/native';
import React from 'react';
import IconButton from '../../IconButton';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { HoldItem } from 'react-native-hold-menu';
import { ThemedStyledProps } from 'styled-components';
import useMangaSource from '@hooks/useMangaSource';
import { ContainerProps } from '@components/Container/Container.interfaces';
import ExpoStorage from '@utils/ExpoStorage';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MenuOption from '@components/MenuOption';
import MenuTitle from '@components/MenuTitle';
import Icon from '@components/Icon';
import { useRootNavigation } from '@navigators/Root';

const generateCSS = (props: ThemedStyledProps<ViewProps & React.RefAttributes<View>, DefaultTheme>) => css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const HeaderBuilder = styled.View<ContainerProps & { paper?: boolean; removeStatusBarPadding?: boolean }>`
  ${generateCSS}
  ${(props) => css`
    ${props.removeStatusBarPadding ? 'min-' : ''}height: ${() => {
      if (!props.removeStatusBarPadding)
        return StatusBar.currentHeight
          ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 10)
          : props.theme.spacing(10);

      return props.theme.spacing(10);
    }};
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
            return props.removeStatusBarPadding
              ? props.theme.spacing(2)
              : StatusBar.currentHeight
              ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 2)
              : props.theme.spacing(2);
          else return StatusBar.currentHeight ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER) : '0px';
        case 'number':
          return props.removeStatusBarPadding
            ? props.theme.spacing(props.verticalPadding ?? 2)
            : StatusBar.currentHeight
            ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + (props.verticalPadding ?? 2))
            : props.theme.spacing(props.verticalPadding ?? 2);
      }
    }};
  `}
`;

export const HeaderBaseContainer = styled.View`
  ${generateCSS}
  ${(props) => css`
    height: ${StatusBar.currentHeight
      ? props.theme.spacing(StatusBar.currentHeight / SPACE_MULTIPLIER + 10)
      : props.theme.spacing(10)};
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
  const navigation = useRootNavigation();
  const [open, setOpen] = React.useState<boolean>(false);
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
  function handleOnOpen() {
    setOpen(true);
  }
  function handleOnClose() {
    setOpen(false);
  }
  async function handleOnSelect(optionValue: number) {
    handleOnClose();
    switch (optionValue) {
      case 0:
        navigation.navigate('SourceSelector');
        break;
      case 1:
        await Linking.openURL('https://' + mangaSource.getLink());
        break;
      case 2:
        break;
    }
  }
  const theme = useTheme();
  return (
    <Menu opened={open} onClose={handleOnClose} onBackdropPress={handleOnClose} onSelect={handleOnSelect}>
      <MenuTrigger>
        <IconButton
          icon={<Image source={{ uri: mangaSource.getIcon() }} style={{ width: 24, height: 24 }} />}
          onPress={handleOnOpen}
        />
      </MenuTrigger>
      <MenuOptions customStyles={theme.menuOptionsStyle}>
        <MenuTitle>{mangaSource.getName()}</MenuTitle>
        <MenuOption text='Change Source' icon={<Icon bundle='Feather' name='book' />} value={0} />
        <MenuOption text='View Website' icon={<Icon bundle='Feather' name='globe' />} value={1} />
        <MenuOption text='Report Source' color='secondary' icon={<Icon bundle='Feather' name='flag' />} />
      </MenuOptions>
    </Menu>
  );
};
