import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { ChapterPageProps } from '@screens/Reader/components/ChapterPage/ChapterPage.interfaces';

const mapStateToProps = (
  state: AppState,
  props: React.PropsWithChildren<ChapterPageProps>,
) => props;

const connector = connect(mapStateToProps);

export type ConnectedChapterPageProps = ConnectedProps<typeof connector>;

export default connector;
