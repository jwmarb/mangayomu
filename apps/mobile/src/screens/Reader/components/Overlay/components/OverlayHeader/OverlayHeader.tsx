import React from 'react';
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
import connector, { ConnectedOverlayHeaderProps } from './OverlayHeader.redux';

const OverlayHeader: React.FC<ConnectedOverlayHeaderProps> = (props) => {
  const {
    mangaTitle,
    style,
    onOpenSettingsMenu,
    onBookmark,
    chapterTitle,
    onTitlePress,
    isBookmarked,
    onBack,
    topOverlayStyle,
  } = props;
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const combinedStyles = [topOverlayStyle, style];

  return (
    <AnimatedBox
      style={combinedStyles}
      background-color={OVERLAY_COLOR}
      pt={theme.style.spacing.s + insets.top}
      pb="s"
      px="m"
    >
      <Stack flex-direction="row" space="s" justify-content="space-between">
        <IconButton
          icon={<Icon type="font" name="arrow-left" />}
          onPress={onBack}
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
      <TouchableWithoutFeedback onPress={onTitlePress}>
        <Text numberOfLines={1} color={OVERLAY_TEXT_PRIMARY}>
          {mangaTitle}
        </Text>
      </TouchableWithoutFeedback>
      <Text numberOfLines={1} color={OVERLAY_TEXT_SECONDARY}>
        {chapterTitle}
      </Text>
    </AnimatedBox>
  );
};

export default connector(React.memo(OverlayHeader));
