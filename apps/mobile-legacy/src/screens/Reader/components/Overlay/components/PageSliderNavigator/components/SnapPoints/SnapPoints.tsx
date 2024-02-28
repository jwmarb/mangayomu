import React from 'react';
import Box, { AnimatedBox } from '@components/Box';
import { useTheme } from '@emotion/react';
import { moderateScale } from 'react-native-size-matters';
import { useSnapPoints } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.context';
import { SnapPointsProps } from './';
import { Freeze } from 'react-freeze';
import useAppSelector from '@hooks/useAppSelector';
import { shouldHidePageNavigator } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.helpers';

const SnapPoints: React.FC<SnapPointsProps> = ({ style }) => {
  const snapPoints = useSnapPoints();
  const freeze = useAppSelector((state) => shouldHidePageNavigator(state));
  const theme = useTheme();
  if (snapPoints.length === 0) return null;
  return (
    <AnimatedBox
      overflow="hidden"
      style={style}
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      flex-direction="row"
      align-items="center"
      justify-content="space-between"
    >
      <Freeze freeze={freeze}>
        {snapPoints.map((x) => (
          <Box
            key={x}
            border-radius={10000}
            background-color={theme.palette.primary.light}
            height={moderateScale(4)}
            width={moderateScale(2)}
            align-self="center"
          />
        ))}
      </Freeze>
    </AnimatedBox>
  );
};

export default React.memo(SnapPoints);
