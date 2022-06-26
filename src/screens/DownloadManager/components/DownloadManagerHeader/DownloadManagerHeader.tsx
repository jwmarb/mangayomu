import { Divider, Flex, Icon, Spacer, Typography } from '@components/core';
import { AppState } from '@redux/store';
import connector, {
  ConnectedDownloadManagerHeaderProps,
} from '@screens/DownloadManager/components/DownloadManagerHeader/DownloadManager.redux';
import { animate, withAnimatedMounting } from '@utils/Animations';
import React from 'react';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

const DownloadManagerHeader: React.FC<ConnectedDownloadManagerHeaderProps> = (props) => {
  const { downloadingKeys } = props;

  return (
    <>
      <Flex container horizontalPadding={3} justifyContent='center' alignItems='center' direction='column'>
        <Icon bundle='MaterialCommunityIcons' name='download-circle-outline' size='large' color='primary' />
        <Spacer y={1} />
        <Typography align='center' variant='subheader'>
          Downloads
        </Typography>
        <Spacer y={1} />
        <Typography color='textSecondary' align='center'>
          {downloadingKeys.length > 0
            ? `Downloading ${downloadingKeys.length} ${downloadingKeys.length === 1 ? 'item' : 'items'}`
            : 'There are no ongoing downloads'}
        </Typography>
      </Flex>
      <Divider />
    </>
  );
};

export default connector(React.memo(DownloadManagerHeader));
