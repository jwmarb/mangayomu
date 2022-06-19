import { Divider, Flex, Icon, Spacer, Typography } from '@components/core';
import { AppState } from '@redux/store';
import { animate, withAnimatedMounting } from '@utils/Animations';
import React from 'react';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

const DownloadManagerHeader: React.FC = (props) => {
  const {} = props;
  const mangasInDownloading = useSelector((state: AppState) => state.chaptersList.mangasInDownloading);
  React.useEffect(() => {
    console.log(Object.keys(mangasInDownloading));
  }, [mangasInDownloading]);
  return (
    <>
      <Flex container horizontalPadding={3} justifyContent='center' alignItems='center' direction='column'>
        <Icon bundle='MaterialCommunityIcons' name='download-circle-outline' size='large' color='primary' />
        <Spacer y={1} />
        {animate(
          <>
            <Typography align='center' variant='subheader'>
              Downloads
            </Typography>
            <Spacer y={1} />
            <Typography color='textSecondary' align='center'>
              You have no ongoing downloads
            </Typography>
          </>,
          withAnimatedMounting
        )}
      </Flex>
      <Divider />
    </>
  );
};

export default React.memo(DownloadManagerHeader);
