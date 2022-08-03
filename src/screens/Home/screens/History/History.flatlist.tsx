import Cover from '@components/Manga/Cover';
import { Typography } from '@components/Typography';
import { MangaHistoryObject } from '@redux/reducers/mangaHistoryReducer/mangaHistoryReducer.interfaces';
import { AppState } from '@redux/store';
import HistoryItem from '@screens/Home/screens/History/components/HistoryItem';
import HistorySection from '@screens/Home/screens/History/components/HistorySection';
import React from 'react';
import { ListRenderItem, SectionListData, SectionListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';

export const keyExtractor = (item: MangaHistoryObject) => item.mangaKey + item.dateRead;
export const renderSectionHeader = (info: {
  section: SectionListData<
    MangaHistoryObject,
    {
      title: string;
      data: MangaHistoryObject[];
    }
  >;
}) => <HistorySection title={info.section.title} />;

export const renderItem: ListRenderItem<MangaHistoryObject> = ({ item }) => {
  return <HistoryItem {...item} />;
};

// const HistorySection: React.FC<{title: string}> = React.memo(() => {

// })

// const HistoryItem: React.FC<MangaHistoryObject> = React.memo(({ dateRead, mangaKey, currentlyReadingChapter }) => {
//   const chapter = useSelector((state: AppState) => state.mangas[mangaKey].chapters[currentlyReadingChapter]);
//   const manga = useSelector((state: AppState) => state.mangas[mangaKey]);
//   return <Cover fixedSize uri={manga.imageCover} />;
// });
