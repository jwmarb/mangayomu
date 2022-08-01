import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { AppState } from '@redux/store';
import MangaHost from '@services/scraper/scraper.abstract';
import { connect, ConnectedProps } from 'react-redux';
import * as readerReducerActions from '@redux/reducers/readerReducer';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { OverloadedSetting } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';

const mapStateToProps = (state: AppState, props: StackScreenProps<RootStackParamList, 'Reader'>) => {
  return {
    ...props,
    deviceOrientation: state.settings.deviceOrientation,
    readerSettingsForSeries: state.readerSetting[props.route.params.mangaKey],
    readerOrientation:
      state.readerSetting[props.route.params.mangaKey] != null &&
      state.readerSetting[props.route.params.mangaKey].orientation !== OverloadedSetting.AUTO
        ? state.readerSetting[props.route.params.mangaKey].orientation
        : state.settings.reader._global.orientation,
    backgroundColor: state.settings.reader.backgroundColor,
    source: MangaHost.availableSources.get(state.mangas[props.route.params.mangaKey].source)!,
    chapter: state.mangas[props.route.params.mangaKey].chapters[props.route.params.chapterKey],
    manga: state.mangas[props.route.params.mangaKey],
    data: state.reader.data,
    showModal: state.reader.showModal,
    readerDirection: ((
      props.route.params.mangaKey in state.readerSetting
        ? state.readerSetting[props.route.params.mangaKey].readingDirection === OverloadedSetting.AUTO
        : true
    )
      ? state.settings.reader._global.readingDirection
      : state.readerSetting[props.route.params.mangaKey].readingDirection) as ReaderDirection,
    error: state.reader.error,
    index: state.reader.index,
    loadingContent: state.reader.loadingContent,
    maintainScrollPositionOffset: state.reader.maintainScrollPositionOffset,
    maintainScrollIndex: state.reader.maintainScrollPositionIndex,
    initialScrollIndex:
      state.reader.maintainScrollPositionIndex === -1
        ? state.mangas[props.route.params.mangaKey].orderedChapters.get(0).link === props.route.params.chapterKey // Get the index where the chapter is, so we know if its the first chapter or not
          ? state.mangas[props.route.params.mangaKey].chapters[props.route.params.chapterKey].indexPage // If it reached here, this is the first chapter. Therefore, no index manipulation is needed.
          : state.mangas[props.route.params.mangaKey].chapters[props.route.params.chapterKey].indexPage + 1 // If it reached here, we do not want to start at the chapter transition, so it should start an index higher.
        : state.reader.maintainScrollPositionIndex, // This is prioritized first if the user is already in reader and is fetching previous chapters
  };
};

const connector = connect(mapStateToProps, readerReducerActions);

export type ConnectedReaderProps = ConnectedProps<typeof connector>;

export default connector;
