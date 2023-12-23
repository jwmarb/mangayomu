import { useBadgeLayoutAnimation } from '@components/Badge/Badge.helpers';
import { ImageBadgeProps } from './';
import Box from '@components/Box';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import { ScaledSheet } from 'react-native-size-matters';
import { Image } from 'react-native';

const styles = ScaledSheet.create({
  image: {
    width: '16@ms' as unknown as number,
    height: '16@ms' as unknown as number,
  },
  container: {
    position: 'absolute',
    top: '4@ms' as unknown as number,
    right: '4@ms' as unknown as number,
    width: '16@ms' as unknown as number,
    height: '16@ms' as unknown as number,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: '4@ms',
  },
});

const ImageBadge: React.FC<ImageBadgeProps> = (props) => {
  const { show = false, children, uri, placement } = props;
  const style = useBadgeLayoutAnimation(show, placement);

  return (
    <Box>
      {children}
      <Box as={Animated.View} style={[style, styles.container]} box-shadow>
        <Image
          // Improved Image
          source={{ uri }}
          style={styles.image}
        />
      </Box>
    </Box>
  );
};

export default ImageBadge;
