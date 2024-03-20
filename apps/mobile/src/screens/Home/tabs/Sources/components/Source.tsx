import { MangaSource } from '@mangayomu/mangascraper';
import React from 'react';
import { Image, View } from 'react-native';
import Text from '@/components/primitives/Text';
import { createStyles } from '@/utils/theme';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import Pressable from '@/components/primitives/Pressable';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';
import { useExploreStore } from '@/stores/explore';

export const SOURCE_HEIGHT = 80;
export const SOURCE_ICON_SIZE = 40;

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    height: SOURCE_HEIGHT,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.style.size.m,
  },
  separator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.style.size.m,
  },
  icon: {
    width: SOURCE_ICON_SIZE,
    height: SOURCE_ICON_SIZE,
  },
}));

type SourceProps = {
  source: MangaSource;
};

function Source(props: SourceProps) {
  const { source } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const imageSrc = { uri: source.ICON_URI };
  const isPinned = useExploreStore((state) =>
    state.pinnedSources.includes(source),
  );
  const pinSource = useExploreStore((state) => state.pinSource);
  const unpinSource = useExploreStore((state) => state.unpinSource);
  function handleOnPress() {
    if (isPinned) unpinSource(source.NAME);
    else pinSource(source.NAME);
  }
  return (
    <Pressable style={style.container} onPress={() => console.log('pressed')}>
      <View style={style.separator}>
        <View style={style.contentContainer}>
          <Image source={imageSrc} style={style.icon} />
          <View>
            <Text bold>{source.NAME}</Text>
            <Text color="textSecondary" variant="body2">
              v{source.API_VERSION}
            </Text>
          </View>
        </View>
        <IconButton
          icon={<Icon type="icon" name={isPinned ? 'pin' : 'pin-outline'} />}
          onPress={handleOnPress}
        />
      </View>
    </Pressable>
  );
}

export default React.memo(Source);
