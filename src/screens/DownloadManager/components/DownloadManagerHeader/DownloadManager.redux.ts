import { AppState } from '@redux/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<{}>) => {
  return {
    ...props,
    downloadingKeys: Object.keys(state.chaptersList.mangasInDownloading),
  };
};

const connector = connect(mapStateToProps);

export type ConnectedDownloadManagerHeaderProps = ConnectedProps<typeof connector>;

export default connector;
