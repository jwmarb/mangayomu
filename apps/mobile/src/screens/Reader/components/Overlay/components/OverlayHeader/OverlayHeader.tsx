import React from 'react';
import { OverlayHeaderProps } from './OverlayHeader.interfaces';
import { AnimatedBox } from '@components/Box';
import {
  OVERLAY_COLOR,
  OVERLAY_TEXT_PRIMARY,
  OVERLAY_TEXT_SECONDARY,
} from '@theme/constants';
import { useTheme } from '@emotion/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Stack from '@components/Stack';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import { TouchableWithoutFeedback } from 'react-native';
import Text from '@components/Text';
import useRootNavigation from '@hooks/useRootNavigation';
import { IMangaSchema } from '@database/schemas/Manga';
import {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

const OverlayHeader: React.FC<OverlayHeaderProps> = (props) => {
  const { manga, opacity, style, onOpenSettingsMenu, onBookmark, chapter } =
    props;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useRootNavigation();
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(
    manga.inLibrary,
  );
  React.useEffect(() => {
    const callback: Realm.ObjectChangeCallback<IMangaSchema> = (change) => {
      setIsBookmarked(change.inLibrary);
    };
    manga.addListener(callback);
    return () => {
      manga.removeListener(callback);
    };
  }, []);
  const topOverlayTranslation = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [-64, 0]),
  );

  const animatedTopOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topOverlayTranslation.value }],
  }));
  const topOverlayStyle = React.useMemo(
    () => [animatedTopOverlayStyle, style],
    [animatedTopOverlayStyle, style],
  );

  function handleOnBack() {
    if (navigation.canGoBack()) navigation.goBack();
  }

  function handleOnPressTitle() {
    navigation.replace('MangaView', manga);
  }

  return (
    <AnimatedBox
      style={topOverlayStyle}
      background-color={OVERLAY_COLOR}
      pt={theme.style.spacing.s + insets.top}
      pb="s"
      px="m"
    >
      <Stack flex-direction="row" space="s" justify-content="space-between">
        <IconButton
          icon={<Icon type="font" name="arrow-left" />}
          onPress={handleOnBack}
          color={OVERLAY_TEXT_SECONDARY}
        />
        <Stack flex-direction="row" space="s">
          <IconButton
            onPress={onBookmark}
            icon={
              <Icon
                type="font"
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              />
            }
            color={OVERLAY_TEXT_SECONDARY}
          />
          <IconButton
            icon={<Icon type="font" name="cog" />}
            color={OVERLAY_TEXT_SECONDARY}
            onPress={onOpenSettingsMenu}
          />
        </Stack>
      </Stack>
      <TouchableWithoutFeedback onPress={handleOnPressTitle}>
        <Text numberOfLines={1} color={OVERLAY_TEXT_PRIMARY}>
          {manga.title}
        </Text>
      </TouchableWithoutFeedback>
      <Text numberOfLines={1} color={OVERLAY_TEXT_SECONDARY}>
        {chapter.name}
      </Text>
    </AnimatedBox>
  );
};

export default OverlayHeader;
