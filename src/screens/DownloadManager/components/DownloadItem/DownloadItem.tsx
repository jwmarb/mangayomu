import React from 'react';
import { Container, Flex, Icon, IconButton, Spacer, Typography } from '@components/core';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import connector, {
  ConnectedDownloadItemProps,
} from '@screens/DownloadManager/components/DownloadItem/DownloadItem.redux';
import Cover from '@components/Manga/Cover';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ButtonBase from '@components/Button/ButtonBase';
import { useRootNavigation } from '@navigators/Root';
import { cursors } from '@redux/reducers/chaptersListReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DownloadItem: React.FC<ConnectedDownloadItemProps> = (props) => {
  const { mangaKey, manga, downloadingManga, downloadingChapter } = props;
  const navigation = useRootNavigation();
  async function handleOnCoverPress() {
    console.log(
      `@downloadCursors -> SIZE = ${(
        (encodeURI(JSON.stringify(cursors.get())).split(/%..|./).length - 1) /
        1024
      ).toFixed(2)} KB`
    );
    // const key = 'persist:@root';
    // const val = await AsyncStorage.getItem(key);
    // if (val != null)
    //   console.log(`${key}-> SIZE = ${((encodeURI(val).split(/%..|./).length - 1) / 1024).toFixed(2)} KB`);
    // else console.log(`${key} is null`);
  }
  return (
    <Flex container horizontalPadding={2} justifyContent='space-between' alignItems='center'>
      <Flex>
        <ButtonBase opacity onPress={handleOnCoverPress}>
          <Cover uri={manga.imageCover} fixedSize='small' />
        </ButtonBase>
        <Spacer x={2} />
        <Flex direction='column'>
          <Typography variant='subheader' numberOfLines={2}>
            {manga.title}
          </Typography>
          <Typography color='textSecondary'>
            Downloaded {downloadingManga.numDownloadCompleted} of {downloadingManga.numToDownload}
          </Typography>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default connector(React.memo(DownloadItem));
