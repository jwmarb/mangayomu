import { useBadgeLayoutAnimation } from '@components/Badge/Badge.helpers';
import { ImageBadgeProps } from '@components/Badge/Badge.interfaces';
import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  image: {
    width: '16@ms',
    height: '16@ms',
  },
  container: {
    position: 'absolute',
    top: '4@ms',
    right: '4@ms',
    width: '16@ms',
    height: '16@ms',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: '4@ms',
  },
});

const ImageBadge: React.FC<ImageBadgeProps> = (props) => {
  const { show, children, uri } = props;
  const style = useBadgeLayoutAnimation(show);
  const theme = useTheme();

  return (
    <Box>
      {children}
      <Box as={Animated.View} style={[style, styles.container]} box-shadow>
        <FastImage source={{ uri }} style={[styles.image]} />
      </Box>
    </Box>
  );
};

export default ImageBadge;
