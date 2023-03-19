import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';

const mapStateToProps = (state: AppState) => ({
  globalReadingDirection: state.settings.reader.readingDirection,
});

const connector = connect(mapStateToProps);

export type ConnectedReaderDirectionProps = ConnectedProps<typeof connector>;

export default connector;
