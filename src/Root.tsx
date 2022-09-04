import React from 'react';
import RootStack from '@navigators/Root';
import WelcomeScreen from '@screens/Welcome';
import HomeScreen from '@screens/Home';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import MangaViewer from '@screens/MangaViewer';
import GenericMangaList from '@screens/GenericMangaList';
import Settings from '@screens/Settings';
import { Header } from '@components/core';
import MangaBrowser from '@screens/MangaBrowser';
import DownloadManager from '@screens/DownloadManager';
import ChapterDownloads from '@screens/ChapterDownloads';
import connector, { ConnectedRootProps } from './Root.redux';
import Reader from '@screens/Reader';
import SourceSelector from '@screens/SourceSelector';

const Root: React.FC<ConnectedRootProps> = (props) => {
  const { downloadAll } = props;
  const showIntroduction = useSelector((state: AppState) => state.settings.showIntroduction);
  const downloads = useSelector((state: AppState) => state.downloading.mangas);

  React.useEffect(() => {
    const dl = downloadAll();
    dl.start();
    return () => {
      dl.cancel();
    };
  }, [downloads]);

  return (
    <RootStack.Navigator initialRouteName={showIntroduction ? 'Welcome' : 'Home'}>
      <RootStack.Screen component={WelcomeScreen} name='Welcome' options={{ headerShown: false }} />
      <RootStack.Screen component={HomeScreen} name='Home' options={{ headerShown: false }} />
      <RootStack.Screen component={MangaViewer} name='MangaViewer' />
      <RootStack.Screen component={Settings} name='Settings' options={{ headerShown: false }} />
      <RootStack.Screen component={GenericMangaList} name='GenericMangaList' />
      <RootStack.Screen component={MangaBrowser} name='MangaBrowser' />
      <RootStack.Screen component={DownloadManager} name='DownloadManager' />
      <RootStack.Screen component={ChapterDownloads} name='ChapterDownloads' />
      <RootStack.Screen component={Reader} name='Reader' options={{ headerShown: false }} />
      <RootStack.Screen component={SourceSelector} name='SourceSelector' />
    </RootStack.Navigator>
  );
};

export default connector(Root);
