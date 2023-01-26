import { AppState } from '@redux/main';
import { ScrollViewProps } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { connect, ConnectedProps } from 'react-redux';
import { disableWelcomeScreen } from '@redux/slices/__initial__';

const mapStateToProps = (
  state: AppState,
  props: {
    scrollPosition: SharedValue<number>;
  } & Pick<ScrollViewProps, 'onScroll'>,
) => ({
  scrollPosition: props.scrollPosition,
  onScroll: props.onScroll,
  hostName: state.host.name,
});

const connector = connect(mapStateToProps, { disableWelcomeScreen });

export type ConnectedOnboardProps = ConnectedProps<typeof connector>;

export default connector;
