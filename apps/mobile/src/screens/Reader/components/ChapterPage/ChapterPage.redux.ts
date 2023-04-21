import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { ChapterPageProps } from '@screens/Reader/components/ChapterPage/ChapterPage.interfaces';
import { setPageError, setLocalPageURI } from '@redux/slices/reader';

const mapStateToProps = (
  state: AppState,
  props: React.PropsWithChildren<ChapterPageProps>,
) => ({
  backgroundColor: state.settings.reader.backgroundColor.toLowerCase(),
  imageComponentType: state.settings.reader.advanced.imageComponent,
  ...props,
});

const connector = connect(mapStateToProps, { setPageError, setLocalPageURI });

export type ConnectedChapterPageProps = ConnectedProps<typeof connector>;

export default connector;
