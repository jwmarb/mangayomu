import { useBadgeLayoutAnimation } from '@components/Badge/Badge.helpers';
import { ImageBadgeProps } from './';
import Box from '@components/Box';
import React from 'react';
import Animated from 'react-native-reanimated';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import ImprovedImage from '@components/ImprovedImage';

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: '4@ms',
  },
});

const ImageBadge: React.FC<ImageBadgeProps> = (props) => {
  const {
    show = false,
    children,
    uri,
    placement,
    width = moderateScale(16),
    height = moderateScale(16),
  } = props;
  const style = useBadgeLayoutAnimation(show, placement);

  return (
    <Box>
      {children}
      <Box as={Animated.View} style={[style, styles.container]}>
        <ImprovedImage
          // Improved Image
          source={{ uri }}
          width={width}
          height={height}
        />
      </Box>
    </Box>
  );
};

export default ImageBadge;
