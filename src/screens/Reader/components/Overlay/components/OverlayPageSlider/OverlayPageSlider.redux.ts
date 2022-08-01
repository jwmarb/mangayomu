import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import React from 'react';
import { OverlayPageSliderProps } from '@screens/Reader/components/Overlay/components/OverlayPageSlider/OverlayPageSlider.interfaces';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<OverlayPageSliderProps>) => ({
  ...props,
  showPageNumber: state.settings.reader.showPageNumber,
});

const connector = connect(mapStateToProps);

export type ConnectedOverlayPageSliderProps = ConnectedProps<typeof connector>;

export default connector;
