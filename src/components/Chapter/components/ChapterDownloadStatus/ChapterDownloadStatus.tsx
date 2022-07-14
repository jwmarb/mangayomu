import { DownloadStatus } from '@utils/DownloadManager';
import React from 'react';
import { ChapterDownloadStatusProps } from './ChapterDownloadStatus.interfaces';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Typography } from '@components/Typography';
import Progress from '@components/Progress';
import Spacer from '@components/Spacer';
import CircularProgress from 'react-native-circular-progress-indicator';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { HoldItem } from 'react-native-hold-menu';
import connector, {
  ConnectedChapterDownloadStatusProps,
} from '@components/Chapter/components/ChapterDownloadStatus/ChapterDownloadStatus.redux';
import { View } from 'react-native';

const ChapterDownloadStatus: React.FC<ConnectedChapterDownloadStatusProps> = (props) => {
  const { status, onDownload, progress, cancelAllForSeries, mangaKey, validateFileIntegrity, chapterKey } = props;
  const theme = useTheme();
  const downloadActions = React.useMemo(
    (): MenuItemProps[] => [
      { isTitle: true, text: 'Actions' },
      {
        text: 'Cancel',
        onPress: async (mangaKey: string) => {
          await cancelAllForSeries(mangaKey);
        },
      } as any,
    ],
    [cancelAllForSeries]
  );

  const downloadedActions = React.useMemo(
    (): MenuItemProps[] => [
      { text: 'Actions', isTitle: true },
      {
        text: 'Validate file integrity',
        icon: 'file',
        onPress: (mangaKey: string, chapterKey: string) => {
          validateFileIntegrity(mangaKey, chapterKey);
        },
      } as any,
    ],
    []
  );

  switch (status) {
    case DownloadStatus.DOWNLOADED:
      return (
        <>
          <HoldItem items={downloadedActions} actionParams={{ 'Validate file integrity': [mangaKey, chapterKey] }}>
            <Icon bundle='MaterialCommunityIcons' name='check-circle-outline' color='secondary' size='small' />
          </HoldItem>
          <Spacer x={1.3} />
        </>
      );
    case DownloadStatus.ERROR:
      return (
        <Typography color='secondary' bold>
          Error
        </Typography>
      );
    case DownloadStatus.IDLE:
    case DownloadStatus.CANCELLED:
      return <IconButton icon={<Icon bundle='Feather' name='download' />} color='primary' onPress={onDownload} />;
    case DownloadStatus.DOWNLOADING:
    case DownloadStatus.START_DOWNLOADING:
    case DownloadStatus.RESUME_DOWNLOADING:
      return (
        <HoldItem items={downloadActions} activateOn='tap' actionParams={{ Cancel: [mangaKey] }}>
          <IconButton
            icon={
              <CircularProgress
                value={progress}
                activeStrokeColor={theme.palette.primary.main.get()}
                progressValueColor={theme.palette.primary.main.get()}
                inActiveStrokeColor={theme.palette.action.disabledBackground.get()}
                maxValue={100}
                duration={500}
                radius={RFValue(14)}
                valueSuffix='%'
                activeStrokeWidth={3}
                inActiveStrokeWidth={3}
              />
            }
          />
        </HoldItem>
      );
    case DownloadStatus.QUEUED:
      return (
        <>
          <HoldItem items={downloadActions} activateOn='tap' actionParams={{ Cancel: [mangaKey] }}>
            <Progress native color='disabled' />
          </HoldItem>
          <Spacer x={0.8} />
        </>
      );
    case DownloadStatus.VALIDATING:
      return <Progress color='disabled' size='small' />;
    default:
      return null;
  }
};

export default connector(React.memo(ChapterDownloadStatus));
