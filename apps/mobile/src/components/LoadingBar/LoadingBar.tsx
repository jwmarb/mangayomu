import React from 'react';
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedBox } from '@components/Box';
import { LoadingBarProps } from './LoadingBar.interfaces';
import { Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const LOADING_BAR_HEIGHT = moderateScale(3);

const LoadingBar: React.FC<LoadingBarProps> = (props) => {
  const { loading } = props;
  const [width, setWidth] = React.useState<number>(
    Dimensions.get('screen').width,
  );

  const loadingOpacity = useSharedValue(0);
  const loadingBarTranslateX = useSharedValue(0);

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));
  const loadingBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: loadingBarTranslateX.value }],
  }));

  function startLoadingAnimation(width: number) {
    loadingOpacity.value = withTiming(1, {
      duration: 150,
      easing: Easing.ease,
    });
    loadingBarTranslateX.value = withRepeat(
      withSequence(
        withTiming(width * 1.3, { duration: 1500, easing: Easing.linear }),
      ),
      -1,
    );
  }

  function endLoadingAnimation() {
    loadingOpacity.value = withTiming(0, {
      duration: 150,
      easing: Easing.ease,
    });
    cancelAnimation(loadingBarTranslateX);
    loadingBarTranslateX.value = 0;
  }

  React.useEffect(() => {
    if (loading) startLoadingAnimation(width);
    else endLoadingAnimation();

    return () => {
      cancelAnimation(loadingOpacity);
      cancelAnimation(loadingBarTranslateX);
    };
  }, [loading]);

  React.useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({ screen }) => {
      setWidth(screen.width);
      endLoadingAnimation();
      if (loading) startLoadingAnimation(screen.width);
    });
    return () => {
      listener.remove();
    };
  }, [loading]);

  return (
    <AnimatedBox
      position="absolute"
      top={0}
      left={0}
      right={0}
      style={loadingStyle}
      height={LOADING_BAR_HEIGHT}
      width="100%"
      background-color="disabled"
    >
      <AnimatedBox
        position="absolute"
        top={0}
        left="-30%"
        width="30%"
        height={LOADING_BAR_HEIGHT}
        background-color="primary"
        style={loadingBarStyle}
      />
    </AnimatedBox>
  );
};

export default LoadingBar;
