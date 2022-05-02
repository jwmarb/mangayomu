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
import CoverSlider from '@screens/Settings/screens/MangasColumn/components/CoverSlider/CoverSlider';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { useIsFocused } from '@react-navigation/native';
import TitleSlider from '@screens/Settings/screens/MangasColumn/components/TitleSlider/TitleSlider';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { adjustColumns as _adjustColumns } from '@redux/reducers/settingsReducer';
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
];

const MangasColumn: React.FC = (props) => {
  const {} = props;
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  const dispatch = useAppDispatch();
  const { adjustColumns } = bindActionCreators({ adjustColumns: _adjustColumns }, dispatch);
  const colValue = useSharedValue(cols);
  const width = useSharedValue(calculateCoverWidth(cols) * SPACE_MULTIPLIER);
  const imageHeight = useSharedValue(calculateCoverHeight(cols) * SPACE_MULTIPLIER);
  React.useEffect(() => {
    return () => {
      adjustColumns(colValue.value);
    };
  }, []);
  const setWidth = React.useCallback((w: number) => {
    colValue.value = w;
    width.value = calculateCoverWidth(w) * SPACE_MULTIPLIER;
    imageHeight.value = calculateCoverHeight(w) * SPACE_MULTIPLIER;
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
              <Typography numberOfLines={2}>{x.title}</Typography>
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
          <CoverSlider value={cols} setValue={setWidth} />
          <TitleSlider />
        </MangasColumnSettingsContainer>
      </Modal>
    </>
  );
};

export default MangasColumn;
