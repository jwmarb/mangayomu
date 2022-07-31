import { LayoutProvider } from 'recyclerlistview';
import { Chapter, Typography, Container, Spacer } from '@components/core';
import { Dimensions } from 'react-native';
import animate from '@utils/Animations/animate';
import withAnimatedLoading from '@utils/Animations/withAnimatedLoading';
import LoadingChapters from '@screens/MangaViewer/components/LoadingChapters';

export const createFooter = (loading: boolean, chapterLen?: number) => () =>
  loading ? (
    <LoadingChapters />
  ) : chapterLen ? (
    chapterLen > 0 ? (
      <Spacer y={16} /> // extra padding for UX reasons
    ) : (
      <Container horizontalPadding={3}>
        <Typography align='center'>There are no chapters :(</Typography>
      </Container>
    )
  ) : null;
