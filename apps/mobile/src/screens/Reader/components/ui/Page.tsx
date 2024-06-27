import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';
import { Dimensions, View } from 'react-native';
import Image from '@/components/primitives/Image';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Progress from '@/components/primitives/Progress';
import useBoolean from '@/hooks/useBoolean';

export type PageProps = {
  type: 'PAGE';
  source: { uri: string };
  chapter: MangaChapter;
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

  function handleOnLoadEnd() {
    toggle(false);
  }

  return (
    <>
      {loading && (
        <View style={style.progress}>
          <Progress size="large" />
        </View>
      )}
      <Image source={source} style={style.image} onLoadEnd={handleOnLoadEnd} />
    </>
  );
});
