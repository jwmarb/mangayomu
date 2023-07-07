import React from 'react';
import Radio from '@components/Radio';
import RadioGroup from '@components/RadioGroup';
import Stack from '@components/Stack';
import { AppearanceMode as Mode, useAppearanceMode } from '@theme/provider';
import Box from '@components/Box/Box';
import PreviewSelectorWrapper from '@screens/Appearance/components/Style/components/PreviewSelectorWrapper/PreviewSelectorWrapper';
import { useTheme } from '@emotion/react';
import { moderateScale } from 'react-native-size-matters';
import { Pressable, useWindowDimensions } from 'react-native';
import { LinePlaceholder } from '@screens/Appearance/components/Style/Style';
import { DIVIDER_DEPTH } from '@theme/constants';
import { coverStyles } from '@components/Cover/Cover';
import Icon from '@components/Icon/Icon';
import { BaseButton } from 'react-native-gesture-handler';
import Text from '@components/Text/Text';
import { AppearanceModePreviewProps } from '@screens/Appearance/components/AppearanceMode/AppearanceMode.interfaces';

const TEXT_SKELETON_HEIGHT = moderateScale(5);

const AppearanceModePreview: React.FC<AppearanceModePreviewProps> = (props) => {
  const { mode, setMode, isSelected, theme } = props;

  function handleOnPress() {
    setMode(mode);
  }
  return (
    <Stack space="s" m="m">
      <PreviewSelectorWrapper isSelected={isSelected}>
        <Box
          border-color={isSelected ? 'primary' : '@theme'}
          background-color={theme.palette.background.paper}
          border-radius="@theme"
          border-width="@theme"
          overflow="hidden"
        >
          <Pressable
            android_ripple={{
              color: theme.palette.action.ripple,
            }}
            onPress={handleOnPress}
          >
            <Stack
              space={moderateScale(4)}
              width={moderateScale(120)}
              height={moderateScale(160)}
            >
              <Box
                background-color={theme.palette.skeleton}
                height={moderateScale(16)}
                width="30%"
                align-self="center"
                style={coverStyles.image}
                border-radius={{ tl: 0, tr: 0 }}
                flex-shrink
              />
              <Stack
                flex-direction="row"
                align-items="center"
                justify-content="center"
                width="70%"
                align-self="center"
              >
                <Box
                  align-self="center"
                  background-color={theme.palette.primary.main}
                  border-radius={10000}
                  height={moderateScale(10)}
                  width="38%"
                />
                <Box width="2%" />
                <Box
                  align-self="center"
                  background-color={theme.palette.secondary.main}
                  border-radius={10000}
                  height={moderateScale(10)}
                  width="28%"
                />
              </Stack>
              <Stack space={moderateScale(2)} align-self="center" width="70%">
                <Box
                  mx="m"
                  border-radius={10000}
                  maxWidth="100%"
                  height={TEXT_SKELETON_HEIGHT}
                  background-color={theme.palette.skeleton}
                />
                <Box
                  mx="m"
                  border-radius={10000}
                  height={TEXT_SKELETON_HEIGHT}
                  maxWidth="100%"
                  background-color={theme.palette.skeleton}
                />
                <Box
                  mx="m"
                  border-radius={10000}
                  height={TEXT_SKELETON_HEIGHT}
                  maxWidth="100%"
                  background-color={theme.palette.skeleton}
                />
                <Box
                  height={DIVIDER_DEPTH}
                  maxWidth="100%"
                  mx="m"
                  background-color={theme.palette.borderColor}
                />
                <Box
                  justify-content="space-between"
                  flex-direction="row"
                  mx="m"
                >
                  <Box
                    border-radius={10000}
                    height={TEXT_SKELETON_HEIGHT}
                    width="20%"
                    background-color={theme.palette.skeleton}
                  />
                  <Box
                    border-radius={10000}
                    height={TEXT_SKELETON_HEIGHT}
                    width="20%"
                    background-color={theme.palette.skeleton}
                  />
                </Box>
                <Box
                  justify-content="space-between"
                  flex-direction="row"
                  mx="m"
                >
                  <Box
                    border-radius={10000}
                    height={TEXT_SKELETON_HEIGHT}
                    width="20%"
                    background-color={theme.palette.skeleton}
                  />
                  <Box
                    border-radius={10000}
                    height={TEXT_SKELETON_HEIGHT}
                    width="20%"
                    background-color={theme.palette.skeleton}
                  />
                </Box>
                <Box
                  justify-content="space-between"
                  flex-direction="row"
                  mx="m"
                >
                  <Box
                    border-radius={10000}
                    height={TEXT_SKELETON_HEIGHT}
                    width="10%"
                    background-color={theme.palette.skeleton}
                  />
                  <Box
                    border-radius={10000}
                    height={TEXT_SKELETON_HEIGHT}
                    width="30%"
                    background-color={theme.palette.skeleton}
                  />
                </Box>
                <Box
                  justify-content="space-between"
                  flex-direction="row"
                  mx="m"
                >
                  <Box
                    border-radius={10000}
                    height={TEXT_SKELETON_HEIGHT}
                    width="20%"
                    background-color={theme.palette.skeleton}
                  />
                  <Box
                    border-radius={10000}
                    height={TEXT_SKELETON_HEIGHT}
                    width="40%"
                    background-color={theme.palette.skeleton}
                  />
                </Box>
              </Stack>
              <Box
                height={DIVIDER_DEPTH}
                background-color={theme.palette.borderColor}
              />
              <Stack space={moderateScale(2)}>
                <Box
                  height={TEXT_SKELETON_HEIGHT}
                  background-color={theme.palette.skeleton}
                  maxWidth="15%"
                  mx="m"
                />
                <Box
                  height={TEXT_SKELETON_HEIGHT}
                  background-color={theme.palette.skeleton}
                  maxWidth="10%"
                  mx="m"
                />
              </Stack>
              <Box
                height={DIVIDER_DEPTH}
                background-color={theme.palette.borderColor}
              />
              <Stack space={moderateScale(2)}>
                <Box
                  height={TEXT_SKELETON_HEIGHT}
                  background-color={theme.palette.skeleton}
                  maxWidth="15%"
                  mx="m"
                />
                <Box
                  height={TEXT_SKELETON_HEIGHT}
                  background-color={theme.palette.skeleton}
                  maxWidth="10%"
                  mx="m"
                />
              </Stack>
              <Box
                height={DIVIDER_DEPTH}
                background-color={theme.palette.borderColor}
              />
              <Stack space={moderateScale(2)}>
                <Box
                  height={TEXT_SKELETON_HEIGHT}
                  background-color={theme.palette.skeleton}
                  maxWidth="15%"
                  mx="m"
                />
                <Box
                  height={TEXT_SKELETON_HEIGHT}
                  background-color={theme.palette.skeleton}
                  maxWidth="10%"
                  mx="m"
                />
              </Stack>
              <Box
                height={DIVIDER_DEPTH}
                background-color={theme.palette.borderColor}
              />
              <Stack space={moderateScale(2)}>
                <Box
                  height={TEXT_SKELETON_HEIGHT}
                  background-color={theme.palette.skeleton}
                  maxWidth="15%"
                  mx="m"
                />
                <Box
                  height={TEXT_SKELETON_HEIGHT}
                  background-color={theme.palette.skeleton}
                  maxWidth="10%"
                  mx="m"
                />
              </Stack>
              <Box
                position="absolute"
                bottom={moderateScale(12)}
                right={moderateScale(12)}
                background-color={theme.palette.primary.main}
                width={moderateScale(16)}
                height={moderateScale(16)}
                border-radius={10000}
                align-items="center"
                justify-content="center"
              >
                <Icon
                  type="font"
                  name="triangle"
                  style={{ transform: [{ rotate: '90deg' }] }}
                  size={moderateScale(5)}
                  color={theme.palette.primary.contrastText}
                />
              </Box>
            </Stack>
          </Pressable>
        </Box>
      </PreviewSelectorWrapper>
      {mode !== Mode.SYSTEM ? (
        <Text>{mode}</Text>
      ) : (
        <Stack space="s" flex-direction="row" align-items="center">
          <Text>{mode}</Text>
          <Text color="textSecondary" variant="book-title">
            (Default)
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export default React.memo(AppearanceModePreview);
