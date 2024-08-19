import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { Dimensions, useWindowDimensions, View } from 'react-native';
import Image from '@/components/primitives/Image';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Progress from '@/components/primitives/Progress';
import useBoolean from '@/hooks/useBoolean';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { getImageDimensions, ResolvedImageAsset } from '@/utils/image';
import { useReadingDirection } from '@/screens/Reader/context';
import { ReadingDirection } from '@/models/schema';

export type PageProps = {
  type: 'PAGE';
  source: ResolvedImageAsset;
  chapter: MangaChapter;
  page: number;
};

const { width, height } = Dimensions.get('window');

const styles = createStyles((theme) => ({
  image: {
    width,
    height,
    resizeMode: 'contain',
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default React.memo(function Page(props: PageProps) {
  const { source } = props;
  const style = useStyles(styles);

  const [loading, toggle] = useBoolean(true);
  const { width: deviceWidth, height: deviceHeight } = useWindowDimensions();
  const readingDirection = useReadingDirection();
  const width = useSharedValue<number>(deviceWidth);
  const height = useSharedValue<number>(
    source.height * (deviceWidth / source.width),
  );

  function handleOnLoadEnd() {
    toggle(false);
  }

  const imageStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    alignSelf:
      readingDirection !== ReadingDirection.WEBTOON ? 'center' : 'auto',
  }));

  return (
    <>
      {loading && (
        <View style={style.progress}>
          <Progress size="large" />
        </View>
      )}
      <Image source={source} style={imageStyle} onLoadEnd={handleOnLoadEnd} />
    </>
  );
});
