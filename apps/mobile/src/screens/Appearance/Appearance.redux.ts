import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import {
  toggleAutoLetterSpacing,
  setBookLetterSpacing,
  setBookDimensions,
  toggleBoldTitleFont,
  toggleAutoBookHeight,
  setTitleAlignment,
  setTitleFontSize,
  setBookStyle,
} from '@redux/slices/settings';

const mapStateToProps = (state: AppState) => state.settings.book;

const connector = connect(mapStateToProps, {
  toggleAutoLetterSpacing,
  setBookLetterSpacing,
  setBookDimensions,
  toggleAutoBookHeight,
  toggleBoldTitleFont,
  setTitleAlignment,
  setTitleFontSize,
  setBookStyle,
});

export type ConnectedAppearanceProps = ConnectedProps<typeof connector>;

export default connector;
