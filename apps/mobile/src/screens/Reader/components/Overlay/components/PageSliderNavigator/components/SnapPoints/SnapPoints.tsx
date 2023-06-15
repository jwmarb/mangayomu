import React from 'react';
import Box, { AnimatedBox } from '@components/Box';
import { useTheme } from '@emotion/react';
import { moderateScale } from 'react-native-size-matters';
import { OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET } from '@theme/constants';
import { useSnapPoints } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.context';
import connector, { ConnectedSnapPointsProps } from './SnapPoints.redux';
import { Freeze } from 'react-freeze';

const SnapPoints: React.FC<ConnectedSnapPointsProps> = ({ style, freeze }) => {
  const snapPoints = useSnapPoints();
  const theme = useTheme();
  if (snapPoints.length === 0) return null;
  return (
    <AnimatedBox
      overflow="hidden"
      style={style}
      position="absolute"
      top={0}
      left={-2}
      right={0}
      bottom={0}
      justify-content="center"
    >
      <Freeze freeze={freeze}>
        {snapPoints.map((x) => (
          <Box
            key={x}
            border-radius={10000}
            background-color={theme.palette.primary.light}
            height={moderateScale(2)}
            width={moderateScale(2)}
            position="absolute"
            left={Math.floor(x - OVERLAY_SLIDER_CIRCLE_DEFAULT_OFFSET)}
          />
        ))}
      </Freeze>
    </AnimatedBox>
  );
};

export default connector(React.memo(SnapPoints));
