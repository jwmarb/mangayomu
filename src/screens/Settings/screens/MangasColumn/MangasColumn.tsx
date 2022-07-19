import React from 'react';
import {
  Slider,
  Screen,
  Spacer,
  Divider,
  Flex,
  Icon,
  Typography,
  Container,
  Header,
  List,
  Modal,
  ListSection,
  ListItem,
  Button,
} from '@components/core';
import Cover from '@components/Manga/Cover';
import { useSelector } from 'react-redux';
import { AppState, useAppDispatch } from '@redux/store';
import { bindActionCreators } from 'redux';
import { Animated, Dimensions, useWindowDimensions, View } from 'react-native';
import {
  MangaCoverPreview,
  MangaCoverPreviewContainer,
  MangasColumnPreviewContainer,
  MangasColumnSettingHeader,
  MangasColumnSettingsContainer,
} from '@screens/Settings/screens/MangasColumn/MangasColumn.base';
import { ScrollView } from 'react-native-gesture-handler';
import { MangaBaseContainer } from '@components/Manga/Manga.base';
import CustomizationSlider from '@screens/Settings/screens/MangasColumn/components/CustomizationSlider/CustomizationSlider';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { useIsFocused } from '@react-navigation/native';
import { onChange, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { adjustColumns as _adjustColumns, adjustTitleSize as _adjustTitleSize } from '@redux/reducers/settingsReducer';
import ItemToggle from '@screens/Settings/screens/components/ItemToggle';
import connector, { ConnectedMangasColumnProps } from './MangasColumn.redux';
import ItemDropdown from '@screens/Settings/screens/components/ItemDropdown';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import MangaPreview from '@screens/Settings/screens/MangasColumn/components/MangaPreview';
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { Menu, MenuOption, MenuTrigger, renderers, MenuOptions } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';
import { FontFamily } from '@theme/Typography';
import { RFValue } from 'react-native-responsive-fontsize';

const sampleMangas = [
  {
    uri: 'https://cover.nep.li/cover/One-Piece.jpg',
    title: 'One Piece',
  },
  {
    uri: 'https://cover.nep.li/cover/Boruto.jpg',
    title: 'Boruto - Naruto Next Generations',
  },
  {
    uri: 'https://cover.nep.li/cover/Bleach.jpg',
    title: 'Bleach',
  },
  {
    uri: 'https://cover.nep.li/cover/Shingeki-No-Kyojin.jpg',
    title: 'Shingeki no Kyojin',
  },
  {
    uri: 'https://cover.nep.li/cover/Naruto.jpg',
    title: 'Naruto',
  },
  {
    uri: 'https://cover.nep.li/cover/Solo-Leveling.jpg',
    title: 'Solo Leveling',
  },
  {
    uri: 'https://cover.nep.li/cover/Jujutsu-Kaisen.jpg',
    title: 'Jujutsu Kaisen',
  },
  {
    uri: 'https://cover.nep.li/cover/The-Beginning-After-The-End.jpg',
    title: 'The Beginning After the End',
  },
];

const MangasColumn: React.FC<ConnectedMangasColumnProps> = (props) => {
  const { cols, fontSize, bold, adjustColumns, adjustTitleSize, coverStyle, toggleBoldTitles, changeCoverStyle } =
    props;
  const { height } = useWindowDimensions();

  const colValue = useSharedValue(cols);
  const fontSizeValue = useSharedValue(fontSize);
  const width = useSharedValue(calculateCoverWidth(cols) * SPACE_MULTIPLIER);
  const imageHeight = useSharedValue(calculateCoverHeight(cols) * SPACE_MULTIPLIER);
  React.useEffect(() => {
    return () => {
      adjustColumns(colValue.value);
      adjustTitleSize(fontSizeValue.value);
    };
  }, []);
  const setWidth = React.useCallback((w: number) => {
    colValue.value = w;
    width.value = calculateCoverWidth(w) * SPACE_MULTIPLIER;
    imageHeight.value = calculateCoverHeight(w) * SPACE_MULTIPLIER;
  }, []);
  const setFontSize = React.useCallback((n: number) => {
    fontSizeValue.value = n;
  }, []);

  const f = useIsFocused();
  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: Header,
    },
    config: {
      useNativeDriver: true,
    },
  };
  const { containerPaddingTop, onScroll, scrollIndicatorInsetTop } = useCollapsibleHeader(options);
  const style = useAnimatedStyle(() => ({
    width: width.value,
  }));
  const imageStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: imageHeight.value,
  }));
  const textStyle = useAnimatedStyle(() => ({
    fontSize: fontSizeValue.value,
  }));
  const mangaStyles: MenuItemProps[] = React.useMemo(
    (): MenuItemProps[] =>
      Object.values(MangaCoverStyles).map((x) => ({
        text: x,
        onPress: () => {
          changeCoverStyle(x);
        },
      })),
    []
  );

  return (
    <>
      <Animated.ScrollView
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: containerPaddingTop }}
        scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}>
        <MangasColumnPreviewContainer>
          {sampleMangas.map((x, i) => (
            <MangaPreview
              key={i}
              style={style}
              uri={x.uri}
              title={x.title}
              textStyle={textStyle}
              imageStyle={imageStyle}
            />
          ))}
        </MangasColumnPreviewContainer>
      </Animated.ScrollView>
      <Modal
        backgroundColor='paper'
        visible={f}
        onClose={() => {}}
        minimumHeight={height * 0.85}
        backdrop={false}
        closeThreshold={height * 0.85}>
        <MangasColumnSettingsContainer>
          <List>
            <ListSection title='Manga covers' />
            <ItemDropdown items={mangaStyles} title='Cover style' subtitle={coverStyle} paper />
            <CustomizationSlider
              value={cols}
              setValue={setWidth}
              range={[1, 3]}
              title='Manga Cover Size'
              description='Adjust the size of the manga cover'
              left={<Icon bundle='MaterialCommunityIcons' name='book-minus' size='small' />}
              right={<Icon bundle='MaterialCommunityIcons' name='book-plus' />}
            />
            <CustomizationSlider
              value={fontSize}
              setValue={setFontSize}
              title='Title Size'
              description='Change the size of the title under the manga cover'
              range={[RFValue(8), RFValue(32)]}
              left={<Icon bundle='MaterialCommunityIcons' name='format-font-size-decrease' size='small' />}
              right={<Icon bundle='MaterialCommunityIcons' name='format-font-size-increase' />}
            />
            <Divider />
            <ListSection title='Text styling' />
            <ItemToggle
              paper
              enabled={bold}
              title='Bold'
              subtitle='Use bold text for the title'
              onChange={toggleBoldTitles}
            />
          </List>
        </MangasColumnSettingsContainer>
      </Modal>
    </>
  );
};

export default connector(MangasColumn);
