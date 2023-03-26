import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { ChapterErrorProps } from '@screens/Reader/components/ChapterError/ChapterError.interfaces';
import { fetchPagesByChapter } from '@redux/slices/reader';

const mapStateToProps = (state: AppState, props: ChapterErrorProps) => props;

const connector = connect(mapStateToProps, { fetchPagesByChapter });

export type ConnectedChapterErrorProps = ConnectedProps<typeof connector>;

export default connector;
