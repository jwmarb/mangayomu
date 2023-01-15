import { Typography } from '@components/Typography';
import { AppState } from '@redux/store';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { NoMoreChaptersContainer } from './NoMoreChapters.base';

const NoMoreChapters: React.FC = (props) => {
  const {} = props;
  const readerDirection = useSelector((state: AppState) => state.settings.reader.preferredReadingDirection);
  const { width, height } = useWindowDimensions();
  return (
    <NoMoreChaptersContainer width={width} height={height} readerDirection={readerDirection}>
      <Typography color='textSecondary'>There are no more chapters</Typography>
    </NoMoreChaptersContainer>
  );
};

export default React.memo(NoMoreChapters);
