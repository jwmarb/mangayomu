import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { ChapterPageProps } from '@screens/Reader/components/ChapterPage/';

const mapStateToProps = (
  state: AppState,
  props: React.PropsWithChildren<ChapterPageProps>,
) => ({
  ...props,
  backgroundColor: state.settings.reader.backgroundColor.toLowerCase(),
  pageAspectRatio: state.reader.pageAspectRatio,
});

const connector = connect(mapStateToProps);

export type ConnectedChapterPageProps = ConnectedProps<typeof connector>;

export default connector;
