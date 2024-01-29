import Animated from 'react-native-reanimated';
import ImprovedImage from './ImprovedImage';
import type {
  ImageProps,
  ImageRequireSource,
  ImageURISource,
} from 'react-native';
export default ImprovedImage;
export { default as ImprovedImageBackground } from './ImprovedImageBackground';

export const AnimatedImprovedImage =
  Animated.createAnimatedComponent(ImprovedImage);
export interface ImprovedImageProps
  extends Omit<ImageProps, 'source' | 'onLoad'> {
  onLoad?: () => void;

  source?: ImageURISource | ImageRequireSource;
  /**
   * Enables image caching through disk
   * @default true
   */
  cache?: boolean;
  /**
   * The duration (in seconds) the image shall last in disk before it should be redownloaded. By default, cache is stale within 3 days
   * @default 259200
   */
  ttl?: number;
}
