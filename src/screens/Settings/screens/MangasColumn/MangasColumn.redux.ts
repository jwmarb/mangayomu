import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import {
  toggleBoldTitles,
  adjustColumns,
  adjustTitleSize,
  changeCoverStyle,
  changeFont,
} from '@redux/reducers/settingsReducer';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<{}>) => ({
  ...props,
  bold: state.settings.mangaCover.bold,
  fontSize: state.settings.mangaCover.fontSize,
  cols: state.settings.mangaCover.perColumn,
  coverStyle: state.settings.mangaCover.style,
});

const connector = connect(mapStateToProps, {
  toggleBoldTitles,
  adjustColumns,
  adjustTitleSize,
  changeCoverStyle,
});

export type ConnectedMangasColumnProps = ConnectedProps<typeof connector>;

export default connector;
