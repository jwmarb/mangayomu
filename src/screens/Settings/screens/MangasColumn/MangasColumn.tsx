import React from 'react';
import { Slider, Screen, Spacer, Divider, Flex, Icon, Typography, Container, Header, Modal } from '@components/core';
import Cover from '@components/Manga/Cover';
import { useSelector } from 'react-redux';
import { AppState, useAppDispatch } from '@redux/store';
import { bindActionCreators } from 'redux';
import { Animated, Dimensions, useWindowDimensions } from 'react-native';
import {
  MangaCoverPreview,
  MangaCoverPreviewContainer,
  MangasColumnPreviewContainer,
  MangasColumnSettingsContainer,
} from '@screens/Settings/screens/MangasColumn/MangasColumn.base';
import { ScrollView } from 'react-native-gesture-handler';
import { MangaBaseContainer } from '@components/Manga/Manga.base';
import CustomizationSlider from '@screens/Settings/screens/MangasColumn/components/CustomizationSlider/CustomizationSlider';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { useIsFocused } from '@react-navigation/native';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { adjustColumns as _adjustColumns, adjustTitleSize as _adjustTitleSize } from '@redux/reducers/settingsReducer';
const { height } = Dimensions.get('window');

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

const MangasColumn: React.FC = (props) => {
  const fontSize = useSelector((state: AppState) => state.settings.mangaCover.fontSize);
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  const dispatch = useAppDispatch();
  const { adjustColumns, adjustTitleSize } = bindActionCreators(
    { adjustColumns: _adjustColumns, adjustTitleSize: _adjustTitleSize },
    dispatch
  );

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

  return (
    <>
      <Animated.ScrollView
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: containerPaddingTop }}
        scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}>
        <MangasColumnPreviewContainer>
          {sampleMangas.map((x, i) => (
            <MangaCoverPreviewContainer style={style} key={i}>
              <MangaCoverPreview source={{ uri: x.uri }} style={imageStyle} />
              <Spacer y={1} />
              <Typography style={textStyle} numberOfLines={2}>
                {x.title}
              </Typography>
            </MangaCoverPreviewContainer>
          ))}
        </MangasColumnPreviewContainer>
      </Animated.ScrollView>
      <Modal
        visible={f}
        onClose={() => {}}
        minimumHeight={height * 0.85}
        backdrop={false}
        closeThreshold={height * 0.85}>
        <MangasColumnSettingsContainer>
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
            range={[8, 32]}
            left={<Icon bundle='MaterialCommunityIcons' name='format-font-size-decrease' size='small' />}
            right={<Icon bundle='MaterialCommunityIcons' name='format-font-size-increase' />}
          />
        </MangasColumnSettingsContainer>
      </Modal>
    </>
  );
};

export default MangasColumn;
