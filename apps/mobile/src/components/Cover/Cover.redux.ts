import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { CoverProps } from '@components/Cover/Cover.interfaces';
import { bookDimensions } from '@components/Book';
import { moderateScale } from 'react-native-size-matters';
const normalCoverDimension = moderateScale(160);

const mapStateToProps = (state: AppState, props: CoverProps) => ({
  cover: props.cover,
  scale: props.scale,
  coverHeight: props.normalBookDimensions
    ? normalCoverDimension
    : state.settings.book.coverHeight,
  width: props.normalBookDimensions
    ? bookDimensions.width
    : state.settings.book.width,
  bookHeight: state.settings.book.height,
  coverStyle: state.settings.book.style,
  children: props.children,
});

const connector = connect(mapStateToProps);

export type ConnectedCoverProps = ConnectedProps<typeof connector>;

export default connector;
