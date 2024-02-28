import { useBadgeLayoutAnimation } from '@components/Badge/Badge.helpers';
import { ImageBadgeProps } from './';
import Box, { AnimatedBox } from '@components/Box';
import React from 'react';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import ImprovedImage from '@components/ImprovedImage';
import Animated from 'react-native-reanimated';

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: '4@ms',
  },
});

const DEFAULT_IMAGE_STYLE = {
  width: moderateScale(16),
  height: moderateScale(16),
} as const;

const ImageBadge: React.FC<ImageBadgeProps> = (props) => {
  const {
    show = false,
    children,
    uri,
    placement,
    style: imageStyle = DEFAULT_IMAGE_STYLE,
    placementOffset,
  } = props;
  const style = useBadgeLayoutAnimation(show, placement, placementOffset);
  const badgeStyle = [style, styles.container];

  return (
    <Box>
      {children}
      <Animated.View style={badgeStyle}>
        <ImprovedImage
          // Improved Image
          source={{ uri }}
          style={imageStyle}
        />
      </Animated.View>
    </Box>
  );
};

export default ImageBadge;
