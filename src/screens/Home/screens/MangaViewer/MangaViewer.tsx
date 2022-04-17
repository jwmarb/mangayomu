import {
  Typography,
  Screen,
  Flex,
  Spacer,
  Container,
  IconButton,
  Icon,
  Skeleton,
  Header,
  Button,
} from '@components/core';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import useAPICall from '@hooks/useAPICall';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import Description from '@screens/Home/screens/MangaViewer/components/Description';
import Authors from '@screens/Home/screens/MangaViewer/components/Authors';
import { useMangaSource } from '@services/scraper';
import React from 'react';
import Title from '@screens/Home/screens/MangaViewer/components/Title';
import MangaCover from '@screens/Home/screens/MangaViewer/components/MangaCover';
import { UseCollapsibleOptions } from 'react-navigation-collapsible';
import MangaValidator from '@utils/MangaValidator';
import Genres from '@screens/Home/screens/MangaViewer/components/Genres';
import { WithGenres } from '@services/scraper/scraper.interfaces';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAppDispatch } from '@redux/store';
import useViewingManga from '@hooks/useViewingManga';
import MangaAction from '@screens/Home/screens/MangaViewer/components/MangaAction';
import { ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import useMountedEffect from '@hooks/useMountedEffect';
import Toast from 'react-native-root-toast';
import { InteractionManager, Platform, ToastAndroid } from 'react-native';
import StatusIndicator from '@screens/Home/screens/MangaViewer/components/StatusIndicator';
import connector, { MangaViewerProps } from '@screens/Home/screens/MangaViewer/MangaViewer.redux';

const displayMessage = (msg: string) =>
  Platform.OS !== 'android'
    ? Toast.show(msg, {
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.SHORT,
        animation: true,
        hideOnPress: true,
        delay: 0,
        shadow: true,
      })
    : ToastAndroid.show(msg, ToastAndroid.SHORT);

const MangaViewer: React.FC<MangaViewerProps> = (props) => {
  const {
    route: {
      params: { manga },
    },
    navigation,
    viewManga,
    userMangaInfo,
    source,
  } = props;
  const {
    state: [meta],
    loading,
    error,
    refresh,
  } = useAPICall(() => source.getMeta(manga));
  const animatedMount = useAnimatedMounting();
  const options: UseCollapsibleOptions = React.useMemo(
    () => ({
      navigationOptions: {
        header: Header,
        headerRight: () => <IconButton icon={<Icon bundle='Feather' name='share-2' />} />,
        headerTitle: '',
      },
      config: {
        useNativeDriver: true,
      },
    }),
    [userMangaInfo?.inLibrary]
  );
  const isAdult = React.useMemo(
    () => userMangaInfo && MangaValidator.isNSFW(userMangaInfo.genres),
    [userMangaInfo?.genres]
  );

  const initializingStateDone = React.useRef(false);

  useMountedEffect(() => {
    if (userMangaInfo != null) {
      if (initializingStateDone.current)
        if (userMangaInfo.inLibrary) displayMessage('Added to library');
        else displayMessage('Removed from library');
      else initializingStateDone.current = true;
    }
  }, [userMangaInfo?.inLibrary]);

  React.useEffect(() => {
    if (!loading && meta) {
      viewManga({ ...manga, ...meta });
    }
  }, [loading, meta]);

  return (
    <Screen scrollable={options}>
      <Container style={animatedMount}>
        <Flex>
          <MangaCover mangaCoverURI={manga.imageCover} />
          <Spacer x={2} />
          <Flex direction='column' shrink>
            <Title title={manga.title} isAdult={isAdult} />
            <Authors manga={manga} loading={loading} authors={meta?.authors} />
            <Spacer y={1} />
            <Genres genres={meta?.genres} loading={loading} />
            <Spacer y={1} />
            <StatusIndicator meta={meta} loading={loading} />
            <Spacer y={1} />
            <MangaAction manga={manga} />
          </Flex>
        </Flex>

        <Spacer y={2} />
        <Description loading={loading} description={meta?.description} />
      </Container>
      <Spacer y={2} />
      <Genres buttons genres={meta?.genres} loading={loading} />
      <Spacer y={2} />
    </Screen>
  );
};

export default connector(MangaViewer);
